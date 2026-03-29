<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function show($id)
    {
        $user = User::with('country')->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'            => 'nullable|string|max:255',
            'phone'           => 'nullable|string|max:20',
            'gender'          => 'nullable|string|in:male,female,other',
            'date_of_birth'   => 'nullable|date',
            'passport_number' => 'nullable|string|max:50',
            'avatar'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $data = array_filter(
            $request->only([
                'name',
                'phone',
                'gender',
                'date_of_birth',
                'passport_number',
            ]),
            fn ($value) => !is_null($value) && $value !== ''
        );

        if (!empty($data)) {
            $user->update($data);
        }

        if ($request->hasFile('avatar')) {

            if ($user->avatar_url) {
                Storage::disk('public')->delete($user->avatar_url);
            }

            $path = $request->file('avatar')->store('avatars', 'public');

            $user->update([
                'avatar_url' => $path
            ]);
        }

        return response()->json(
            $user->load('country')
        );
    }
}
