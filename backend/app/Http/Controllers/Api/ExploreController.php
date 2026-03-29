<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Explore;

class ExploreController extends Controller
{
    public function index()
    {
        return response()->json(
            Explore::all()
        );
    }

    public function show($id)
    {
        return response()->json(
            Explore::findOrFail($id)
        );
    }
}
