import { FaPowerOff, FaHome } from "react-icons/fa";
import "../css/header.css";
import { useContext } from "react";
import { AuthenticationContext } from "./Authentication";
import { logOut } from "../api";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser } = useContext(AuthenticationContext);

  // Logout current user
  async function handleLogout(event) {
    event.preventDefault();
    await logOut();
    navigate("/");
  }

  return (
    <div className="header-container">
      <h4>Hola, {currentUser ? currentUser.displayName : "no user"}</h4>

      {/* Add navigation to home in the add and retrieve pages*/}
      <div className="header-nav-container">
        {["/add", "/retrieve"].includes(location.pathname) && (
          <NavLink className="return-home-link" to="/">
            Inicio <FaHome />
          </NavLink>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Salir <FaPowerOff />
        </button>
      </div>
    </div>
  );
}
