<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
    /**
     * ADMIN LOGIN (API STYLE - NO SESSION REGENERATE)
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Sai tài khoản hoặc mật khẩu'
            ], 401);
        }

        $user = Auth::user();

        if (!$user || $user->role !== 'admin') {
            Auth::logout();

            return response()->json([
                'message' => 'Không có quyền admin'
            ], 403);
        }

        return response()->json([
            'message' => 'Đăng nhập admin thành công',
            'user'    => $user
        ]);
    }

    /**
     * ADMIN LOGOUT
     */
    public function logout()
    {
        Auth::logout();

        return response()->json([
            'message' => 'Đã đăng xuất'
        ]);
    }

    /**
     * GET CURRENT ADMIN
     */
    public function me()
    {
        return response()->json([
            'user' => Auth::user()
        ]);
    }
}
