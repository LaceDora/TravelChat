<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TourDepartures;
use Illuminate\Http\Response;

class TourDeparturesController extends Controller
{
    public function index()
    {
        return response()->json(
            TourDepartures::with('tour')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tour_id' => 'required|exists:tours,id',
            'departure_date' => 'required|date',
            'capacity' => 'required|integer',
            'booked' => 'nullable|integer',
            'price' => 'required|numeric',
            'discount_percent' => 'nullable|numeric',
            'is_promotion' => 'nullable|boolean',
            'promotion_end' => 'nullable|date',
            'status' => 'nullable|string',
        ]);

        $departure = TourDepartures::create($data);

        return response()->json($departure, Response::HTTP_CREATED);
    }

    public function show($id)
    {
        return response()->json(
            TourDepartures::with('tour')->findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $departure = TourDepartures::findOrFail($id);

        $data = $request->validate([
            'tour_id' => 'sometimes|exists:tours,id',
            'departure_date' => 'sometimes|date',
            'capacity' => 'sometimes|integer',
            'booked' => 'nullable|integer',
            'price' => 'sometimes|numeric',
            'discount_percent' => 'nullable|numeric',
            'is_promotion' => 'nullable|boolean',
            'promotion_end' => 'nullable|date',
            'status' => 'nullable|string',
        ]);

        $departure->update($data);

        return response()->json($departure);
    }

    public function destroy($id)
    {
        $departure = TourDepartures::findOrFail($id);
        $departure->delete();

        return response()->json(['message' => 'Deleted']);
    }

    // ✅ QUAN TRỌNG (fix lỗi của bạn)
    public function byTour($tourId)
    {
        return response()->json(
            TourDepartures::where('tour_id', $tourId)->get()
        );
    }
}