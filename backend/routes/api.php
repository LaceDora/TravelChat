<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| CONTROLLERS
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Admin\AdminAuthController;

use App\Http\Controllers\Api\{
    CountryController,
    ExploreController,
    LocationController,
    HotelController,
    RestaurantController,
    TourController,
    BlogController,
    BookingController,
    PaymentController,
    UserMarkerController,
    ProfileController,
    ServiceBookingController
};

use App\Http\Controllers\Admin\{
    UserController as AdminUserController,
    CategoryController,
    ExploreController as AdminExploreController,
    LocationController as AdminLocationController,
    HotelController as AdminHotelController,
    HotelRoomController as AdminHotelRoomController,
    RestaurantController as AdminRestaurantController,
    RestaurantTableController as AdminRestaurantTableController,
    TourController as AdminTourController,
    BlogController as AdminBlogController,
    TourScheduleController as AdminTourScheduleController
};


/*
|--------------------------------------------------------------------------
| AUTH (USER)
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/logout',   [AuthController::class, 'logout']);


/*
|--------------------------------------------------------------------------
| ADMIN AUTH
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {

    Route::post('/login',  [AdminAuthController::class, 'login']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me',      [AdminAuthController::class, 'me']);

});


/*
|--------------------------------------------------------------------------
| ADMIN API
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {

    Route::apiResource('users', AdminUserController::class);

    Route::apiResource('categories', CategoryController::class)
        ->except(['show']);

    Route::apiResource('explores', AdminExploreController::class)
        ->except(['show']);

    Route::apiResource('locations', AdminLocationController::class);

    Route::apiResource('hotels', AdminHotelController::class);

    Route::apiResource('restaurants', AdminRestaurantController::class);

    Route::apiResource('tours', AdminTourController::class);

    Route::apiResource('blogs', AdminBlogController::class);


    /*
    |--------------------------------------------------------------------------
    | HOTEL ROOMS
    |--------------------------------------------------------------------------
    */

    Route::get('hotels/{hotel}/rooms', [AdminHotelRoomController::class, 'byHotel']);

    Route::get('hotel-rooms/{id}', [AdminHotelRoomController::class, 'show']);
    Route::post('hotel-rooms', [AdminHotelRoomController::class, 'store']);
    Route::put('hotel-rooms/{id}', [AdminHotelRoomController::class, 'update']);
    Route::delete('hotel-rooms/{id}', [AdminHotelRoomController::class, 'destroy']);


    /*
    |--------------------------------------------------------------------------
    | RESTAURANT TABLES
    |--------------------------------------------------------------------------
    */

    Route::get('restaurants/{restaurant}/tables', [AdminRestaurantTableController::class, 'byRestaurant']);

    Route::get('restaurant-tables/{id}', [AdminRestaurantTableController::class, 'show']);
    Route::post('restaurant-tables', [AdminRestaurantTableController::class, 'store']);
    Route::put('restaurant-tables/{id}', [AdminRestaurantTableController::class, 'update']);
    Route::delete('restaurant-tables/{id}', [AdminRestaurantTableController::class, 'destroy']);

    /*
|--------------------------------------------------------------------------
| TOUR SCHEDULES
|--------------------------------------------------------------------------
*/

Route::get('tours/{tour}/schedules', [AdminTourScheduleController::class, 'byTour']);

Route::get('tour-schedules/{id}', [AdminTourScheduleController::class, 'show']);
Route::post('tour-schedules', [AdminTourScheduleController::class, 'store']);
Route::put('tour-schedules/{id}', [AdminTourScheduleController::class, 'update']);
Route::delete('tour-schedules/{id}', [AdminTourScheduleController::class, 'destroy']);


});
/*
|--------------------------------------------------------------------------
| TOUR SCHEDULES
|--------------------------------------------------------------------------
*/

Route::get('tours/{tour}/schedules', [AdminTourScheduleController::class, 'byTour']);

Route::get('tour-schedules/{id}', [AdminTourScheduleController::class, 'show']);
Route::post('tour-schedules', [AdminTourScheduleController::class, 'store']);
Route::put('tour-schedules/{id}', [AdminTourScheduleController::class, 'update']);
Route::delete('tour-schedules/{id}', [AdminTourScheduleController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| PUBLIC API
|--------------------------------------------------------------------------
*/

Route::apiResource('countries', CountryController::class)
    ->only(['index','show']);

Route::apiResource('explores', ExploreController::class)
    ->only(['index','show']);

Route::apiResource('locations', LocationController::class)
    ->only(['index','show']);

Route::apiResource('hotels', HotelController::class)
    ->only(['index','show']);

Route::apiResource('restaurants', RestaurantController::class)
    ->only(['index','show']);

Route::apiResource('tours', TourController::class)
    ->only(['index','show']);

Route::apiResource('blogs', BlogController::class)
    ->only(['index','show']);


/*
|--------------------------------------------------------------------------
| EXTRA PUBLIC DATA
|--------------------------------------------------------------------------
*/

Route::get('/hotels/{id}/rooms', [HotelController::class, 'rooms']);
Route::get('/restaurants/{id}/tables', [RestaurantController::class, 'tables']);


/*
|--------------------------------------------------------------------------
| BOOKINGS
|--------------------------------------------------------------------------
*/

Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings/{id}', [BookingController::class, 'show']);
Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
Route::get('/my-bookings', [BookingController::class, 'myBookings']);


/*
|--------------------------------------------------------------------------
| USER (LOGIN REQUIRED)
|--------------------------------------------------------------------------
*/

Route::middleware('auth.session')->group(function () {

    Route::get('/users/{id}', [ProfileController::class, 'show']);
    Route::put('/users/{id}', [ProfileController::class, 'update']);

    Route::get('/service/options', [ServiceBookingController::class, 'getOptions']);
    Route::post('/service/book',   [ServiceBookingController::class, 'store']);
    Route::get('/service/my-bookings', [ServiceBookingController::class, 'myBookings']);

    Route::post('/payments', [PaymentController::class, 'store']);

    Route::get('/markers',  [UserMarkerController::class, 'index']);
    Route::post('/markers', [UserMarkerController::class, 'store']);

});


/*
|--------------------------------------------------------------------------
| PAYMENT
|--------------------------------------------------------------------------
*/

Route::post('/payment/create', [PaymentController::class, 'createPayment']);
Route::get('/payment/vnpay-return', [PaymentController::class, 'vnpayReturn']);
Route::post('/payment/vnpay-ipn', [PaymentController::class, 'vnpayIpn']);