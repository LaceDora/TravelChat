<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MapItem;

class MapController extends Controller
{
    // Map chung
    public function index()
    {
        return response()->json([
            'status' => true,
            'data' => MapItem::all()
        ]);
    }

    // Map chi tiết (1 địa điểm)
    public function show($id)
    {
        return response()->json([
            'status' => true,
            'data' => MapItem::findOrFail($id)
        ]);
    }
}
