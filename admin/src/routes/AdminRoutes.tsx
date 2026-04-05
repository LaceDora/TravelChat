import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layout/AdminLayout";

// Pages
import Dashboard from "../pages/dashboard/Dashboard";
import AdminLogin from "../pages/admin/AdminLogin";

// User
import UserList from "../pages/users/UserList";
import UserCreate from "../pages/users/UserCreate";
import UserEdit from "../pages/users/UserEdit";

// Location
import LocationsList from "../pages/locations/LocationList";
import LocationCreate from "../pages/locations/LocationCreate";
import LocationEdit from "../pages/locations/LocationEdit";

// Hotels
import HotelsList from "../pages/hotels/HotelList";
import HotelCreate from "../pages/hotels/HotelCreate";
import HotelEdit from "../pages/hotels/HotelEdit";

// Rooms
import HotelRooms from "../pages/hotels/HotelRooms";
import RoomCreate from "../pages/hotels/RoomCreate";
import RoomEdit from "../pages/hotels/RoomEdit";

// Restaurants
import RestaurantList from "../pages/restaurants/RestaurantList";
import RestaurantCreate from "../pages/restaurants/RestaurantCreate";
import RestaurantEdit from "../pages/restaurants/RestaurantEdit";

// Restaurant Tables
import RestaurantTableList from "../pages/restaurants/RestaurantTableList";
import RestaurantTableCreate from "../pages/restaurants/RestaurantTableCreate";
import RestaurantTableEdit from "../pages/restaurants/RestaurantTableEdit";

// TOURS
import TourList from "../pages/tours/TourList";
import TourCreate from "../pages/tours/TourCreate";
import TourEdit from "../pages/tours/TourEdit";

// TOUR SCHEDULES
import TourScheduleList from "../pages/tours/TourScheduleList";
import TourScheduleCreate from "../pages/tours/TourScheduleCreate";
import TourScheduleEdit from "../pages/tours/TourScheduleEdit";

// BLOGS
import BlogList from "../pages/blogs/BlogList";
import BlogCreate from "../pages/blogs/BlogCreate";
import BlogEdit from "../pages/blogs/BlogEdit";

// Bookings
import BookingList from "../pages/bookings/BookingList";
import BookingDetail from "../pages/bookings/BookingDetail";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ADMIN AREA */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* DASHBOARD */}
        <Route index element={<Dashboard />} />

        {/* USERS */}
        <Route path="users" element={<UserList />} />
        <Route path="users/create" element={<UserCreate />} />
        <Route path="users/edit/:id" element={<UserEdit />} />

        {/* LOCATIONS */}
        <Route path="locations" element={<LocationsList />} />
        <Route path="locations/create" element={<LocationCreate />} />
        <Route path="locations/edit/:id" element={<LocationEdit />} />

        {/* HOTELS */}
        <Route path="hotels" element={<HotelsList />} />
        <Route path="hotels/create" element={<HotelCreate />} />
        <Route path="hotels/edit/:id" element={<HotelEdit />} />

        {/* HOTEL ROOMS */}
        <Route path="hotels/:hotelId/rooms" element={<HotelRooms />} />
        <Route path="hotels/:hotelId/rooms/create" element={<RoomCreate />} />
        <Route
          path="hotels/:hotelId/rooms/edit/:roomId"
          element={<RoomEdit />}
        />

        {/* RESTAURANTS */}
        <Route path="restaurants" element={<RestaurantList />} />
        <Route path="restaurants/create" element={<RestaurantCreate />} />
        <Route path="restaurants/edit/:id" element={<RestaurantEdit />} />

        {/* RESTAURANT TABLES */}
        <Route
          path="restaurants/:restaurantId/tables"
          element={<RestaurantTableList />}
        />

        <Route
          path="restaurants/:restaurantId/tables/create"
          element={<RestaurantTableCreate />}
        />

        <Route
          path="restaurants/:restaurantId/tables/edit/:id"
          element={<RestaurantTableEdit />}
        />

        {/* TOURS */}
        <Route path="tours" element={<TourList />} />
        <Route path="tours/create" element={<TourCreate />} />
        <Route path="tours/edit/:id" element={<TourEdit />} />

        {/* TOUR SCHEDULES */}
        <Route path="tours/:id/schedules" element={<TourScheduleList />} />

        <Route
          path="tours/:id/schedules/create"
          element={<TourScheduleCreate />}
        />

        <Route
          path="tours/:id/schedules/edit/:scheduleId"
          element={<TourScheduleEdit />}
        />

        {/* BLOGS */}
        <Route path="blogs" element={<BlogList />} />
        <Route path="blogs/create" element={<BlogCreate />} />
        <Route path="blogs/edit/:id" element={<BlogEdit />} />
        {/* BOOKINGS */}
        <Route path="bookings" element={<BookingList />} />
        <Route path="bookings/:id" element={<BookingDetail />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
