<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserMarker;
use Illuminate\Http\Request;

class UserMarkerController extends Controller
{
    public function store(Request $request)
    {
        return response()->json(
            UserMarker::create([
                'user_id' => session('user_id'),
                'lat' => $request->lat,
                'lng' => $request->lng,
                'label' => $request->label,
            ])
        );
    }

    public function index()
    {
        return response()->json(
            UserMarker::where('user_id', session('user_id'))->get()
        );
    }
}
