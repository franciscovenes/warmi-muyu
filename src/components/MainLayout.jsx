import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../css/mainLayout.css";

export default function MainLayout() {
  return (
    <div className="mainLayout-container">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
