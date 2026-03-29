<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // =========================
    // 1. TẠO LINK THANH TOÁN
    // =========================
    public function createPayment(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|integer',
            'user_id'    => 'required|integer',
            'price'      => 'required|numeric|min:1',
        ]);

        $payment = Payment::create([
            'booking_id' => $request->booking_id,
            'user_id'    => $request->user_id,
            'amount'     => $request->price,
            'method'     => 'vnpay',
            'status'     => 'pending',
        ]);

        $vnp_TmnCode    = config('vnpay.tmn_code');
        $vnp_HashSecret = config('vnpay.hash_secret');
        $vnp_Url        = config('vnpay.url');
        $vnp_ReturnUrl  = config('vnpay.return_url');

        $inputData = [
            "vnp_Version"    => "2.1.0",
            "vnp_Command"    => "pay",
            "vnp_TmnCode"    => $vnp_TmnCode,
            "vnp_Amount"     => $request->price * 100,
            "vnp_CurrCode"   => "VND",
            "vnp_TxnRef"     => $payment->id,
            "vnp_OrderInfo"  => "Thanh toan booking #" . $payment->id,
            "vnp_OrderType"  => "billpayment",
            "vnp_Locale"     => "vn",
            "vnp_ReturnUrl"  => $vnp_ReturnUrl,
            "vnp_IpAddr"     => $request->ip(),
            "vnp_CreateDate" => date('YmdHis'),
        ];

        ksort($inputData);

        $hashData = "";
        $query = "";

        foreach ($inputData as $key => $value) {
            $hashData .= $key . "=" . $value . "&";
            $query    .= urlencode($key) . "=" . urlencode($value) . "&";
        }

        $hashData = rtrim($hashData, "&");
        $query    = rtrim($query, "&");

        $vnp_SecureHash = hash_hmac("sha512", $hashData, $vnp_HashSecret);

        $paymentUrl = $vnp_Url . "?" . $query . "&vnp_SecureHash=" . $vnp_SecureHash;

        return response()->json([
            'payment_url' => $paymentUrl
        ]);
    }


    // =========================
    // 2. VNPay RETURN (USER)
    // =========================
    public function vnpayReturn(Request $request)
    {
        $vnp_HashSecret = config('vnpay.hash_secret');

        $inputData = [];

        foreach ($request->all() as $key => $value) {
            if (substr($key, 0, 4) === "vnp_" && $key !== "vnp_SecureHash") {
                $inputData[$key] = $value;
            }
        }

        ksort($inputData);

        $hashData = "";
        foreach ($inputData as $key => $value) {
            $hashData .= $key . "=" . $value . "&";
        }
        $hashData = rtrim($hashData, "&");

        $checkHash = hash_hmac("sha512", $hashData, $vnp_HashSecret);

        // Kiểm tra chữ ký
        if ($checkHash !== $request->vnp_SecureHash) {
            return redirect('http://localhost:5173/payment-success?status=error');
        }

        $payment = Payment::find($request->vnp_TxnRef);
        if (!$payment) {
            return redirect('http://localhost:5173/payment-success?status=error');
        }

        // Nếu thanh toán thất bại
        if ($request->vnp_ResponseCode !== '00') {
            $payment->update(['status' => 'failed']);
            return redirect('http://localhost:5173/payment-success?status=error');
        }

        // Thành công
        $payment->update([
            'status' => 'completed',
            'transaction_id' => $request->vnp_TransactionNo,
        ]);

        Booking::where('id', $payment->booking_id)
            ->update(['status' => 'paid']);

        return redirect('http://localhost:5173/payment-success?status=success');
    }


    // =========================
    // 3. VNPay IPN (SERVER)
    // =========================
    public function vnpayIpn(Request $request)
    {
        $vnp_HashSecret = config('vnpay.hash_secret');

        $inputData = [];

        foreach ($request->all() as $key => $value) {
            if (substr($key, 0, 4) === "vnp_" && $key !== "vnp_SecureHash") {
                $inputData[$key] = $value;
            }
        }

        ksort($inputData);

        $hashData = "";
        foreach ($inputData as $key => $value) {
            $hashData .= $key . "=" . $value . "&";
        }
        $hashData = rtrim($hashData, "&");

        $checkHash = hash_hmac("sha512", $hashData, $vnp_HashSecret);

        if ($checkHash !== $request->vnp_SecureHash) {
            return response()->json(['RspCode' => '97', 'Message' => 'Invalid signature']);
        }

        $payment = Payment::find($request->vnp_TxnRef);

        if (!$payment) {
            return response()->json(['RspCode' => '01', 'Message' => 'Order not found']);
        }

        if ($request->vnp_ResponseCode === '00') {
            $payment->update(['status' => 'completed']);

            Booking::where('id', $payment->booking_id)
                ->update(['status' => 'paid']);

            return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
        }

        $payment->update(['status' => 'failed']);
        return response()->json(['RspCode' => '00', 'Message' => 'Payment Failed']);
    }
}
