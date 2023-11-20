import Footer from "../components/Footer";
import logo from "/img/logo.png";
import "../css/login.css";
import { useState, useContext } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { signIn } from "../api";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { AuthenticationContext } from "../components/Authentication";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(AuthenticationContext);

  // State that determines if the password is shown or hidden
  const [showPassword, setShowPassword] = useState(false);

  // State that stores login input data
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // State that stores error message from login outcome
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  // State to control if user is logging in
  const [loginStatus, setLoginStatus] = useState(false);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setLoginData((prevLoginData) => ({
      ...prevLoginData,
      [name]: value,
    }));
  }

  async function handleLogin(event) {
    setLoginErrorMsg("");
    event.preventDefault();
    setLoginStatus(true);

    // Sign in and store outcome to check for errors
    const newUser = await signIn(loginData.email, loginData.password);

    if (newUser === "auth/invalid-email" || newUser === "auth/user-not-found") {
      setLoginErrorMsg("Usuaria no registrada");
    } else if (
      newUser === "auth/invalid-login-credentials" ||
      newUser === "auth/missing-password"
    ) {
      setLoginErrorMsg("Contraseña Incorrecta. Inténtalo de nuevo!");
    } else {
      navigate("/");
    }
    setLoginStatus(false);
  }

  // On page reload, wait for currentUser state to be set (in the Authentication component)
  if (currentUser === undefined) return null;

  // If logged in successfully, redirect to the homepage (it will pass the auth required protection component). Display login page elements otherwise.
  return currentUser ? (
    <Navigate
      to="/"
      state={{ message: "Debes ingresar para acceder a la app" }}
    />
  ) : (
    <div className="login-container">
      <img src={logo} className="logo" />

      <form className="form login-form" autoComplete="off">
        {location.state?.message ? (
          <h4>{location.state.message}</h4>
        ) : (
          <h4>Iniciar sesión</h4>
        )}
        <div className="login-form-box">
          <label className="form-label">Correo electrónico:</label>
          <div className="login-form-input-container">
            <input
              id="login-input-email"
              className="login-form-input"
              type="text"
              placeholder=""
              onChange={handleInputChange}
              value={loginData.email}
              name="email"
            />
          </div>
        </div>

        <div className="login-form-box">
          <label className="form-label">Password:</label>
          <div className="login-form-input-container">
            <input
              id="login-input-password"
              className="login-form-input"
              type={showPassword ? "text" : "password"}
              placeholder=""
              onChange={handleInputChange}
              name="password"
              value={loginData.password}
            />
            {showPassword ? (
              <BiHide
                className="registerUser-form-input-icon registerUser-icon-visible"
                onClick={() =>
                  setShowPassword((prevShowPassword) => !prevShowPassword)
                }
              />
            ) : (
              <BiShow
                className="registerUser-form-input-icon registerUser-icon-visible"
                onClick={() =>
                  setShowPassword((prevShowPassword) => !prevShowPassword)
                }
              />
            )}
          </div>
        </div>
        {loginErrorMsg && <p className="login-err-msg">{loginErrorMsg}</p>}
        <button className="btn form-btn" onClick={handleLogin}>
          {loginStatus ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <Footer />
    </div>
  );
}
