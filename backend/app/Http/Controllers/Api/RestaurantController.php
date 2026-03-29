<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Models\RestaurantTable;

class RestaurantController extends Controller
{
    public function index()
    {
        return Restaurant::all();
    }

    public function show($id)
    {
        return Restaurant::findOrFail($id);
    }

    // 👉 API cho ServiceDetail
    public function tables($id)
    {
        return RestaurantTable::where('restaurant_id', $id)->get();
    }
}

