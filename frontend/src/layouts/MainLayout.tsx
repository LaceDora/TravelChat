import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
// import SearchBar from "../components/common/SearchBar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Header />
      {/* <SearchBar /> */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
