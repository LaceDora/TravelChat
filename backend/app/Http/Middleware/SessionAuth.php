<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SessionAuth
{
    public function handle(Request $request, Closure $next)
    {
        if (!session()->has('user_id')) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        return $next($request);
    }
}
