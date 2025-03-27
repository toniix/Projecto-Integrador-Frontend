import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetail from "./pages/ProductDetail";
import Header from "./components/common/Header"; // Nuevo Header
import Home from "./pages/Home"; // Nueva página Home
import FooterWrapper from "./layouts/FooterWrapper"; // Nuevo FooterWrapper
import { AdminPanel } from "./pages/admin/AdminPanel";
import Profile from "./pages/Profile"; // Nueva página Profile
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { RootProvider } from "./context";
import "./styles/Button.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./context/auth/privateRoute"; // Ensure this path is correct
import NotFound from "./pages/NotFound"; // Nueva página NotFound
import "react-datepicker/dist/react-datepicker.css"; // Para implementar la selección de rango de fechas requerida en la HU #22
import FavoritesPage from "./pages/FavoritesPage"; // Nueva página FavoritesPage

export const App = () => {
  return (
    <RootProvider>
      <Router>
        <Header /> {/* El Header se muestra en todas las rutas */}
        <Routes>
          <Route path="/" element={<Home />} />{" "}
          {/* Ruta principal para la Home */}
          <Route path="/product/:id" element={<ProductDetail />} />
          {/* <Route path="/register" element={<RegisterForm />} /> */}
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["ADMIN"]}>
                <AdminPanel />
              </PrivateRoute>
            }
          />{" "}
          {/* Nueva ruta de Admin */}
          <Route
            path="/profile"
            element={
              <PrivateRoute roles={["USER", "ADMIN"]}>
                <Profile />
              </PrivateRoute>
            }
          />{" "}
          {/* Nueva ruta de Profile Favoritos*/}
          <Route
            path="/favorites"
            element={
              <PrivateRoute roles={["USER", "ADMIN"]}>
                <FavoritesPage />
              </PrivateRoute>
            }
          />{" "}
          {/* Nueva ruta de Profile */}
          <Route path="*" element={<NotFound />} />{" "}
          {/* Ruta para manejar páginas no encontradas */}
        </Routes>
        <FooterWrapper />{" "}
        {/* Reemplazar el <Footer /> existente por <FooterWrapper /> */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </RootProvider>
  );
};
