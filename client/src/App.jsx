import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import HotelReg from "./components/HotelReg";
import Navbar from "./components/Navbar";
import AllRooms from "./pages/AllRooms";
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import RoomDetails from "./pages/RoomDetails";
import AddRoom from "./pages/admin/AddRoom";
import Dashboard from "./pages/admin/Dashboard";
import Layout from "./pages/admin/Layout";
import ListRoom from "./pages/admin/ListRoom";

function App() {
  const isDashboardPath = useLocation().pathname.includes("admin");
  return (
    <div>
      {!isDashboardPath && <Navbar />}
      {false && <HotelReg />}
      <div className="min-h-[70vh] ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
