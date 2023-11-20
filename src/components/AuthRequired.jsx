import { Outlet, Navigate } from "react-router-dom";
import { useContext, useState, createContext, useEffect } from "react";
import { AuthenticationContext } from "./Authentication";
import { monitorElementCollection } from "../api";

const AuthRequiredContext = createContext();

export default function AuthRequired() {
  // State for elements collections in database
  const [lists, setLists] = useState({});

  // Create listeners for changes in elements collections in database, update if needed.
  useEffect(() => {
    const unsubscribeModels = monitorElementCollection("models", setLists);
    const unsubscribeArtisans = monitorElementCollection("artisans", setLists);
    const unsubscribeTypes = monitorElementCollection("types", setLists);
    const unsubscribeConditions = monitorElementCollection(
      "conditions",
      setLists
    );
    const unsubscribeColors = monitorElementCollection("colors", setLists);
    const unsubscribeStates = monitorElementCollection("states", setLists);

    return () => {
      unsubscribeModels();
      unsubscribeArtisans();
      unsubscribeTypes();
      unsubscribeConditions();
      unsubscribeColors();
      unsubscribeStates();
    };
  }, []);

  const { currentUser } = useContext(AuthenticationContext);

  // On page reload, wait for currentUser state to be set (in the Authentication component)
  if (currentUser === undefined) return null;

  // If there's no current user, redirect to the login page
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        state={{ message: "Debes autenticarte para acceder a la app" }}
      />
    );
  }

  return (
    <AuthRequiredContext.Provider value={{ lists }}>
      <Outlet />
    </AuthRequiredContext.Provider>
  );
}

export { AuthRequiredContext };
