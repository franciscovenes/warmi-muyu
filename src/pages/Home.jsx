import "../css/home.css";
import { NavLink } from "react-router-dom";
import logo from "/img/logo.png";
import RegisterUser from "../components/RegisterUser";
import Fade from "../components/Fade";
import { useState, useContext } from "react";
import { AuthenticationContext } from "../components/Authentication";

export default function Home() {
  const { currentUser } = useContext(AuthenticationContext);

  // State to mount/unmount signup component
  const [register, setRegister] = useState(false);

  return (
    <div className="home-container">
      <img className="logo" src={logo} alt="logo" />
      {/* Navigation links to add and retrieve pages */}
      <nav className="home-nav">
        <NavLink className="home-nav-link" to="/add">
          Añadir item
        </NavLink>

        <NavLink className="home-nav-link" to="/retrieve">
          Consultar items
        </NavLink>
      </nav>

      {/* Button to mount/unmount signup component */}
      {currentUser.admin && (
        <button
          className="home-register-btn"
          onClick={() => setRegister((prevRegister) => !prevRegister)}
        >
          {register ? "Cerrar" : "Registrar usuaria"}
        </button>
      )}
      {/* Display of signup component */}
      {currentUser.admin && (
        <div className="home-register-box">
          <Fade show={register}>
            <RegisterUser />
          </Fade>
        </div>
      )}
    </div>
  );
}
