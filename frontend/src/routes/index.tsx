import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProfileLayout from "../layouts/ProfileLayout";

// Pages
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Profile from "../pages/profile/Profile";

// Blog
import BlogDetail from "../pages/blog/BlogDetail";

// Locations
import LocationPage from "../pages/locations/LocationPage";
import LocationDetail from "../pages/locations/LocationDetail";
import Favorites from "../pages/locations/Favorites";

// Services
import ServicePage from "../pages/services/ServicePage";
import ServiceDetail from "../pages/services/ServiceDetail";
import ServiceBooking from "../pages/services/ServiceBooking";
import HotelListPage from "../pages/services/HotelListPage";
import RestaurantListPage from "../pages/services/RestaurantListPage";

// Tours
import TourPage from "../pages/tours/TourPage";
import TourDetail from "../pages/tours/TourDetail";
import Payment from "../pages/payment/Payment";
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import BookingTour from "../pages/tours/BookingTour";
import BookingHistory from "../pages/bookings/BookingHistory";
import BookingDetail from "../pages/bookings/BookingDetail";

function AppRoutes() {
  return (
    <Routes>
      {/* ================= MAIN WEBSITE ================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        {/* Blog detail (từ Home) */}
        <Route path="/blogs/:id" element={<BlogDetail />} />

        {/* Locations */}
        <Route path="/locations" element={<LocationPage />} />
        <Route path="/locations/:id" element={<LocationDetail />} />
        <Route path="/favorites" element={<Favorites />} />

        {/* Services */}
        <Route path="/services" element={<ServicePage />} />
        <Route path="/services/hotels" element={<HotelListPage />} />
        <Route path="/services/restaurants" element={<RestaurantListPage />} />
        <Route path="/services/:type/:id" element={<ServiceDetail />} />
        <Route path="/services/:type/:id/book" element={<ServiceBooking />} />

        {/* Tours */}
        <Route path="/tours" element={<TourPage />} />
        <Route path="/tours/:id" element={<TourDetail />} />
        <Route path="/booking-tour" element={<BookingTour />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-return" element={<PaymentSuccess />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/bookings" element={<BookingHistory />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
      </Route>

      {/* ================= AUTH ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= PROFILE ================= */}
      <Route element={<ProfileLayout />}>
        <Route path="/profile/:id" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
