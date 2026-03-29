<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;

class CountryController extends Controller
{
    public function index()
    {
        return response()->json(
            Country::all()
        );
    }

    public function show($id)
    {
        return response()->json(
            Country::findOrFail($id)
        );
    }
}
