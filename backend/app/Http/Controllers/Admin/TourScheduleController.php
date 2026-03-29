<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TourSchedule;

class TourScheduleController extends Controller
{
    /**
     * Get schedules by tour
     */
    public function byTour($tourId)
    {
        $schedules = TourSchedule::where('tour_id', $tourId)
            ->orderBy('day_number')
            ->get();

        return response()->json($schedules);
    }

    /**
     * Show single schedule
     */
    public function show($id)
    {
        $schedule = TourSchedule::findOrFail($id);

        return response()->json($schedule);
    }

    /**
     * Create schedule
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tour_id' => 'required|exists:tours,id',
            'day_number' => 'required|integer|min:1',
            'title' => 'required|string|max:255',
            'activity' => 'nullable|string'
        ]);

        $schedule = TourSchedule::create($validated);

        return response()->json([
            'message' => 'Schedule created successfully',
            'data' => $schedule
        ], 201);
    }

    /**
     * Update schedule
     */
    public function update(Request $request, $id)
    {
        $schedule = TourSchedule::findOrFail($id);

        $validated = $request->validate([
            'day_number' => 'required|integer|min:1',
            'title' => 'required|string|max:255',
            'activity' => 'nullable|string'
        ]);

        $schedule->update($validated);

        return response()->json([
            'message' => 'Schedule updated successfully',
            'data' => $schedule
        ]);
    }

    /**
     * Delete schedule
     */
    public function destroy($id)
    {
        $schedule = TourSchedule::findOrFail($id);

        $schedule->delete();

        return response()->json([
            'message' => 'Schedule deleted successfully'
        ]);
    }
}