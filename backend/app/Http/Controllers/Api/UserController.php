<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function me(Request $request)
    {
        // Lấy từ session mà AuthController đã lưu khi Login
        $userId = session('user_id');

        if (!$userId) {
            return response()->json(['message' => 'Chưa đăng nhập'], 401);
        }

        // with('country') để lấy thông tin quốc gia cho frontend
        $user = User::with('country')->find($userId);

        if (!$user) {
            return response()->json(['message' => 'User không tồn tại'], 404);
        }

        return response()->json($user);
    }

    // Gộp logic từ đoạn code bạn đưa vào hàm update
    public function update(Request $request, $id)
    {
        // 1. Lấy ID của người dùng đang đăng nhập từ session
        $currentLoggedInId = session('user_id');

        // 2. Bảo mật: Kiểm tra nếu ID muốn sửa không trùng với ID đang đăng nhập
        if ($currentLoggedInId != $id) {
            return response()->json(['message' => 'Bạn không có quyền chỉnh sửa thông tin người khác'], 403);
        }

        // 3. Tìm user cần sửa
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // 4. Validate dữ liệu (tùy chọn nhưng nên có)
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
        ]);

        // 5. Cập nhật dữ liệu
        $user->update($request->all());

        return response()->json([
            'message' => 'Cập nhật thành công',
            'user' => $user
        ]);
    }

    // Bạn có thể giữ hoặc xóa hàm updateProfile cũ tùy ý
    // Nhưng nên dùng hàm update($id) để khớp với route Route::put('/users/{id}')
}