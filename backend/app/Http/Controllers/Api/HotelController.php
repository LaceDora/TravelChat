<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\HotelRoom;

class HotelController extends Controller
{
    public function index()
    {
        return Hotel::all();
    }

    public function show($id)
    {
        return Hotel::findOrFail($id);
    }

    // 👉 API cho ServiceDetail
    public function rooms($id)
    {
        return HotelRoom::where('hotel_id', $id)->get();
    }
}

