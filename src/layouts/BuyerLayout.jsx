import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function BuyerLayout() {
  return (
    <>
      <Navbar />

      <div className="buyer-layout">
        <Outlet />
      </div>

      <Footer />
    </>
  );
}
