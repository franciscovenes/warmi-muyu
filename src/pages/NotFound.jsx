import { NavLink } from "react-router-dom";
import logoNotFound from "/img/logoNotFound.png";
import Footer from "../components/Footer";
import "../css/notFound.css";

export default function NotFound() {
  return (
    <div className="notFound-container">
      <img className="notFound-logo" src={logoNotFound} alt="logo" />
      <h4>Página no encontrada</h4>
      <NavLink to="/">Volver al inicio</NavLink>
      <Footer />
    </div>
  );
}
