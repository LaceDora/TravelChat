# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjIzYzZlZThmOWQ3MzRlMGVhODc3YzAyZTdiZDFkNTUyIiwiaCI6Im11cm11cjY0In0=

import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layout/AdminLayout";

// Pages
import Dashboard from "../pages/dashboard/Dashboard";

import UserList from "../pages/users/UserList";
import UserCreate from "../pages/users/UserCreate";
import UserEdit from "../pages/users/UserEdit";

import CategoryList from "../pages/categories/CategoryList";
import CategoryCreate from "../pages/categories/CategoryCreate";
import CategoryEdit from "../pages/categories/CategoryEdit";

import ExploreList from "../pages/explores/ExploreList";
import ExploreCreate from "../pages/explores/ExploreCreate";
import ExploreEdit from "../pages/explores/ExploreEdit";

import LocationList from "../pages/locations/LocationList";
import LocationCreate from "../pages/locations/LocationCreate";
import LocationEdit from "../pages/locations/LocationEdit";

import HotelList from "../pages/hotels/HotelList";
import HotelCreate from "../pages/hotels/HotelCreate";
import HotelEdit from "../pages/hotels/HotelEdit";

import RestaurantList from "../pages/restaurants/RestaurantList";
import RestaurantCreate from "../pages/restaurants/RestaurantCreate";
import RestaurantEdit from "../pages/restaurants/RestaurantEdit";

import TourList from "../pages/tours/TourList";
import TourCreate from "../pages/tours/TourCreate";
import TourEdit from "../pages/tours/TourEdit";

import BlogList from "../pages/blogs/BlogList";
import BlogCreate from "../pages/blogs/BlogCreate";
import BlogEdit from "../pages/blogs/BlogEdit";

import BookingList from "../pages/bookings/BookingList";
import BookingDetail from "../pages/bookings/BookingDetail";

const AdminRoutes = () => {
return (
<Routes>
{/_ ADMIN ROOT _/}
<Route path="/admin" element={<AdminLayout />}>
{/_ Dashboard _/}
<Route index element={<Dashboard />} />

        {/* USERS */}
        <Route path="users" element={<UserList />} />
        <Route path="users/create" element={<UserCreate />} />
        <Route path="users/:id/edit" element={<UserEdit />} />

        {/* CATEGORIES */}
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/create" element={<CategoryCreate />} />
        <Route path="categories/:id/edit" element={<CategoryEdit />} />

        {/* EXPLORES */}
        <Route path="explores" element={<ExploreList />} />
        <Route path="explores/create" element={<ExploreCreate />} />
        <Route path="explores/:id/edit" element={<ExploreEdit />} />

        {/* LOCATIONS */}
        <Route path="locations" element={<LocationList />} />
        <Route path="locations/create" element={<LocationCreate />} />
        <Route path="locations/:id/edit" element={<LocationEdit />} />

        {/* HOTELS */}
        <Route path="hotels" element={<HotelList />} />
        <Route path="hotels/create" element={<HotelCreate />} />
        <Route path="hotels/:id/edit" element={<HotelEdit />} />

        {/* RESTAURANTS */}
        <Route path="restaurants" element={<RestaurantList />} />
        <Route path="restaurants/create" element={<RestaurantCreate />} />
        <Route path="restaurants/:id/edit" element={<RestaurantEdit />} />

        {/* TOURS */}
        <Route path="tours" element={<TourList />} />
        <Route path="tours/create" element={<TourCreate />} />
        <Route path="tours/:id/edit" element={<TourEdit />} />

        {/* BLOGS */}
        <Route path="blogs" element={<BlogList />} />
        <Route path="blogs/create" element={<BlogCreate />} />
        <Route path="blogs/:id/edit" element={<BlogEdit />} />

        {/* BOOKINGS */}
        <Route path="bookings" element={<BookingList />} />
        <Route path="bookings/:id" element={<BookingDetail />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>

);
};

export default AdminRoutes;
