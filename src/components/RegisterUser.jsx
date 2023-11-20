import { useEffect, useRef, useState } from "react";
import "../css/registerUser.css";
import { FaCheckCircle } from "react-icons/fa";
import { BiHide, BiShow } from "react-icons/bi";
import { signUp } from "../api";

export default function RegisterUser() {
  // State with new user data
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "",
  });

  // console.log("new User: ", newUser);

  // State that tracks if new user's data complies with the rules established
  const [newUserSuccess, setNewUserSuccess] = useState({
    username: false,
    email: false,
    password: false,
    repeatPassword: false,
  });

  // console.log("New user S: ", newUserSuccess);

  // State that determines if the password and repetition are shown or hidden
  const [passwordShow, setPasswordShow] = useState({
    password: false,
    repeatPassword: false,
  });

  // State with message and status of the registration outcome
  const [registerMessage, setRegisterMessage] = useState({
    message: "",
    err: false,
  });

  // State to control ongoing signup
  const [registerStatus, setRegisterStatus] = useState(false);

  // Reference to keep track of changes on each property of newUser
  const prevNewUserRef = useRef({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  // Verification of newUser's fields is done every 500ms instead of on every key stroke/change
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if username is >= than 2 and password is >=8 and has at least one digit [0-9] and one letter [a-z] (case insensitive)
      function checkInputFormat(type) {
        if (type === "username" && newUser[type].length < 2) {
          return;
        } else if (
          (type === "password" && newUser[type].length < 8) ||
          (type === "password" &&
            !(/\d/.test(newUser[type]) && /[a-zA-Z]/.test(newUser[type])))
        ) {
          return;
        }
        handleNewUserSuccess(type, true);
      }

      // Checks email format
      function checkEmailFormat() {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test(newUser.email)) {
          handleNewUserSuccess("email", true);
        }
      }

      // Verifies data according to the previous functions
      function verifyData() {
        if (newUser.username !== prevNewUserRef.current?.username) {
          handleNewUserSuccess("username", false);

          checkInputFormat("username");
        }

        if (newUser.email !== prevNewUserRef.current?.email) {
          handleNewUserSuccess("email", false);

          checkEmailFormat();
        }

        if (newUser.password !== prevNewUserRef.current?.password) {
          handleNewUserSuccess("password", false);

          checkInputFormat("password");

          if (newUser.password === newUser.repeatPassword) {
            handleNewUserSuccess("repeatPassword", true);
          } else {
            handleNewUserSuccess("repeatPassword", false);
          }
        }

        if (newUser.repeatPassword !== prevNewUserRef.current?.repeatPassword) {
          handleNewUserSuccess("repeatPassword", false);

          if (
            newUser.password === newUser.repeatPassword &&
            newUser.repeatPassword
          ) {
            handleNewUserSuccess("repeatPassword", true);
          }
        }
      }
      verifyData();
    }, 500);

    return () => clearTimeout(timer);
  }, [newUser]);

  function handleNewUserSuccess(name, status) {
    setNewUserSuccess((prevState) => ({
      ...prevState,
      [name]: status,
    }));
  }

  function handleChangeInput(event) {
    const { name, value } = event.target;
    prevNewUserRef.current = newUser;
    setNewUser((prevNewUser) => ({
      ...prevNewUser,
      [name]: value,
    }));
  }

  async function registerUser(event) {
    event.preventDefault();
    setRegisterStatus(true);
    // Attempts to signup user - returns error code if fails

    const user = await signUp({
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
    });

    // Handle messages with signup outcome
    if (user.message === "auth/email-already-exists") {
      setRegisterMessage({
        message: "El correo electrónico ya fue registrado anteriormente",
        err: true,
      });
    } else {
      setRegisterMessage({
        message: `${newUser.username} registrada con successo!`,
        err: false,
      });
    }

    setNewUser({
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
    });

    setRegisterStatus(false);
  }

  return (
    <div className="registerUser-container">
      <form className="form registerUser-form" autoComplete="off">
        {/* Username */}
        <div className="registerUser-form-inputContainer">
          <input
            className="registerUser-form-input"
            type="text"
            placeholder="Añadir nombre de usuaria..."
            value={newUser.username}
            onChange={handleChangeInput}
            name="username"
            required
          />
          {/* Show check circle if input passes data verification */}
          {newUserSuccess.username && (
            <FaCheckCircle className="registerUser-form-input-icon" />
          )}
        </div>

        {/* Displays message if it fails verification */}
        <p
          className={`registerUser-field-message-error ${
            newUserSuccess.username || !newUser.username
              ? ""
              : "registerUser-field-message-error-visible"
          }`}
        >
          Nombre de usuaria demasiado corto
        </p>

        {/* Email */}
        <div className="registerUser-form-inputContainer">
          <input
            className="registerUser-form-input"
            type="text"
            placeholder="Añadir correo electrónico..."
            value={newUser.email}
            onChange={handleChangeInput}
            name="email"
            required
          />
          {newUserSuccess.email && (
            <FaCheckCircle className="registerUser-form-input-icon" />
          )}
        </div>
        <p
          className={`registerUser-field-message-error ${
            newUserSuccess.email || !newUser.email
              ? ""
              : "registerUser-field-message-error-visible"
          }`}
        >
          Correo electrónico inválido
        </p>

        {/* Password */}
        <div className="registerUser-form-inputContainer">
          <input
            className="registerUser-form-input"
            type={passwordShow.password ? "text" : "password"}
            placeholder="Añadir contraseña..."
            value={newUser.password}
            onChange={handleChangeInput}
            name="password"
            required
          />
          {/* Show/hide password by clicking the button */}
          {passwordShow.password ? (
            <BiHide
              className="registerUser-form-input-icon registerUser-icon-visible"
              onClick={() =>
                setPasswordShow((prevState) => ({
                  ...prevState,
                  password: !prevState.password,
                }))
              }
            />
          ) : (
            <BiShow
              className="registerUser-form-input-icon registerUser-icon-visible"
              onClick={() =>
                setPasswordShow((prevState) => ({
                  ...prevState,
                  password: !prevState.password,
                }))
              }
            />
          )}
          {newUserSuccess.password && (
            <FaCheckCircle className="registerUser-form-input-icon" />
          )}
        </div>
        <p
          className={`registerUser-field-message-error ${
            newUserSuccess.password || !newUser.password
              ? ""
              : "registerUser-field-message-error-visible"
          }`}
        >
          La contraseña debe contener por lo menos 8 caracteres, entre letras y
          numeros
        </p>

        {/* Repeat Password */}
        <div className="registerUser-form-inputContainer">
          <input
            className="registerUser-form-input"
            type={passwordShow.repeatPassword ? "text" : "password"}
            placeholder="Repetir contraseña..."
            value={newUser.repeatPassword}
            onChange={handleChangeInput}
            name="repeatPassword"
            required
          />
          {passwordShow.repeatPassword ? (
            <BiHide
              className="registerUser-form-input-icon registerUser-icon-visible"
              onClick={() =>
                setPasswordShow((prevState) => ({
                  ...prevState,
                  repeatPassword: !prevState.repeatPassword,
                }))
              }
            />
          ) : (
            <BiShow
              className="registerUser-form-input-icon registerUser-icon-visible"
              onClick={() =>
                setPasswordShow((prevState) => ({
                  ...prevState,
                  repeatPassword: !prevState.repeatPassword,
                }))
              }
            />
          )}

          {newUserSuccess.repeatPassword && (
            <FaCheckCircle className="registerUser-form-input-icon" />
          )}
        </div>
        <p
          className={`registerUser-field-message-error ${
            newUserSuccess.repeatPassword || !newUser.repeatPassword
              ? ""
              : "registerUser-field-message-error-visible"
          }`}
        >
          Las contraseñas no son identicas
        </p>

        {/* Choose new user's role */}
        <div className="registerUser-form-role">
          <h4>Selecciona el rol de la nueva usuaria:</h4>

          <label
            className="form-label registerUser-radio-label"
            htmlFor="admin"
          >
            <input
              type="radio"
              id="admin"
              name="role"
              value="admin"
              checked={newUser.role === "admin"}
              onChange={handleChangeInput}
            />
            Admin
          </label>

          <label
            className="form-label registerUser-radio-label"
            htmlFor="editor"
          >
            <input
              type="radio"
              id="editor"
              name="role"
              value="editor"
              checked={newUser.role === "editor"}
              onChange={handleChangeInput}
            />
            Editor
          </label>
        </div>

        {/* Only enable register button if all fields comply with data verification */}
        <button
          className="btn"
          onClick={registerUser}
          disabled={
            !Object.values(newUserSuccess).every((key) => key === true) ||
            registerStatus
          }
        >
          {registerStatus ? "Registrando.." : "Registar"}
        </button>
      </form>
      {/* Display message with the outcome of signup */}
      {registerMessage.message.length > 0 && (
        <p
          className={`${
            registerMessage.err
              ? "registerUser-message-error registerUser-message-error-visible"
              : ""
          }`}
        >
          {registerMessage.message}
        </p>
      )}
    </div>
  );
}
