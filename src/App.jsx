import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentication from "./components/Authentication";
import { lazy, Suspense } from "react";

const Add = lazy(() => {
  return import("./pages/Add");
});

const Retrieve = lazy(() => {
  return import("./pages/Retrieve");
});

const Login = lazy(() => {
  return import("./pages/Login");
});

const Home = lazy(() => {
  return import("./pages/Home");
});

const NotFound = lazy(() => {
  return import("./pages/NotFound");
});

const MainLayout = lazy(() => {
  return import("./components/MainLayout");
});

const AuthRequired = lazy(() => {
  return import("./components/AuthRequired");
});

function App() {
  return (
    <Authentication>
      <Router>
        <Routes>
          <Route
            element={
              <Suspense fallback={<h2>Cargando...</h2>}>
                <AuthRequired />
              </Suspense>
            }
          >
            <Route
              element={
                <Suspense fallback={<h2>Cargando...</h2>}>
                  <MainLayout />
                </Suspense>
              }
            >
              <Route
                path="/"
                element={
                  <Suspense fallback={<h2>Cargando...</h2>}>
                    <Home />
                  </Suspense>
                }
              />
              <Route
                path="add"
                element={
                  <Suspense fallback={<h2>Cargando...</h2>}>
                    <Add />
                  </Suspense>
                }
              />
              <Route
                path="retrieve"
                element={
                  <Suspense fallback={<h2>Cargando...</h2>}>
                    <Retrieve />
                  </Suspense>
                }
              />
            </Route>
          </Route>
          <Route
            path="/login"
            element={
              <Suspense fallback={<h2>Cargando...</h2>}>
                <Login />
              </Suspense>
            }
          ></Route>
          <Route
            path="*"
            element={
              <Suspense fallback={<h2>Cargando...</h2>}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </Router>
    </Authentication>
  );
}

export default App;
