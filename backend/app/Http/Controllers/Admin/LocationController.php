<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Danh sách location
     */
    public function index()
    {
        $locations = Location::with('country')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($locations);
    }

    /**
     * Tạo location mới
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:150',
            'country_id' => 'required|exists:countries,id',
            'description'=> 'nullable|string',
            'address'    => 'nullable|string',
            'lat'        => 'nullable|numeric',
            'lng'        => 'nullable|numeric',
            'image_url'  => 'nullable|string',
        ]);

        $location = Location::create($request->all());

        return response()->json([
            'message' => 'Tạo location thành công',
            'data' => $location
        ], 201);
    }

    /**
     * Xem chi tiết location
     */
    public function show($id)
    {
        $location = Location::with('country')->findOrFail($id);

        return response()->json($location);
    }

    /**
     * Cập nhật location
     */
    public function update(Request $request, $id)
    {
        $location = Location::findOrFail($id);

        $request->validate([
            'name'       => 'required|string|max:150',
            'country_id' => 'required|exists:countries,id',
            'description'=> 'nullable|string',
            'address'    => 'nullable|string',
            'lat'        => 'nullable|numeric',
            'lng'        => 'nullable|numeric',
            'image_url'  => 'nullable|string',
        ]);

        $location->update($request->all());

        return response()->json([
            'message' => 'Cập nhật location thành công',
            'data' => $location
        ]);
    }

    /**
     * Xóa location
     */
    public function destroy($id)
    {
        $location = Location::findOrFail($id);
        $location->delete();

        return response()->json([
            'message' => 'Xóa location thành công'
        ]);
    }
}