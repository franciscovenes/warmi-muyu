import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import { monitorAuth } from "../api";
const AuthenticationContext = createContext();

export default function Authentication({ children }) {
  // State for currently authenticated user
  const [currentUser, setCurrentUser] = useState();

  // Create listener for changes in firebase authentication and update currentUser state, if needed.
  useEffect(() => {
    const unsubscribeAuth = monitorAuth(setCurrentUser);
    return () => {
      unsubscribeAuth;
    };
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export { AuthenticationContext };

Authentication.propTypes = {
  children: PropTypes.node,
};
