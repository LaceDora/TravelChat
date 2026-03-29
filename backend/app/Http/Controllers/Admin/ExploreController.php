<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Explore;
use Illuminate\Http\Request;

class ExploreController extends Controller
{
    public function index()
    {
        return Explore::with(['category', 'country'])->get();
    }

    public function store(Request $request)
    {
        return Explore::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $explore = Explore::findOrFail($id);
        $explore->update($request->all());
        return $explore;
    }

    public function destroy($id)
    {
        return Explore::destroy($id);
    }
}
