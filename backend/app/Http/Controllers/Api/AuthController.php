<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * ĐĂNG KÝ
     */
    public function register(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name'       => 'required|string|max:255',
        'email'      => 'required|email|unique:users,email',
        'password'   => 'required|min:6|confirmed',
        'country_id' => 'required|exists:countries,id',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    $user = User::create([
        'name'       => $request->name,
        'email'      => $request->email,
        'password'   => Hash::make($request->password),
        'country_id' => $request->country_id,
    ]);

    return response()->json([
        'status' => true,
        'message' => 'Đăng ký thành công',
        'user' => $user->load('country')
    ], 201);
}


    /**
     * ĐĂNG NHẬP
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Email hoặc mật khẩu không đúng'
            ], 401);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Đăng nhập thành công',
            'user'    => $user->load('country'), // ✅ QUAN TRỌNG
        ]);
    }

    /**
     * LOGOUT
     */
    public function logout()
    {
        return response()->json([
            'status' => true,
            'message' => 'Đã đăng xuất'
        ]);
    }
}
