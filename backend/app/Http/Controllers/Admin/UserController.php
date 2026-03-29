<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Danh sách user + admin
     */
    public function index()
    {
        $users = User::with('country')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    /**
     * Tạo user mới (admin tạo)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|in:user,admin',
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'passport_number' => 'nullable|string',
            'country_id' => 'nullable|exists:countries,id',
            'avatar_url' => 'nullable|string'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone' => $request->phone,
            'gender' => $request->gender,
            'date_of_birth' => $request->date_of_birth,
            'passport_number' => $request->passport_number,
            'country_id' => $request->country_id,
            'avatar_url' => $request->avatar_url
        ]);

        return response()->json([
            'message' => 'Tạo user thành công',
            'data' => $user
        ], 201);
    }

    /**
     * Xem chi tiết user
     */
    public function show($id)
    {
        $user = User::with('country')->findOrFail($id);

        return response()->json($user);
    }

    /**
     * Cập nhật user
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|in:user,admin',
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'passport_number' => 'nullable|string',
            'country_id' => 'nullable|exists:countries,id',
            'avatar_url' => 'nullable|string'
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'phone' => $request->phone,
            'gender' => $request->gender,
            'date_of_birth' => $request->date_of_birth,
            'passport_number' => $request->passport_number,
            'country_id' => $request->country_id,
            'avatar_url' => $request->avatar_url
        ]);

        return response()->json([
            'message' => 'Cập nhật user thành công',
            'data' => $user
        ]);
    }

    /**
     * Đổi mật khẩu user
     */
    public function updatePassword(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|min:6'
        ]);

        $user = User::findOrFail($id);

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Đổi mật khẩu thành công'
        ]);
    }

    /**
     * Xóa user
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if (auth()->check() && auth()->id() === $user->id) {
            return response()->json([
                'message' => 'Không thể xóa chính mình'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Xóa user thành công'
        ]);
    }
}