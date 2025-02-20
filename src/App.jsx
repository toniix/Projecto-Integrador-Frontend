import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { InstrumentProvider } from "./context/InstrumentContext";
import { RegisterInstrumentButton } from "./components/common/RegisterInstrumentButton";
import Header from "./components/common/Header"; // Nuevo Header
import Home from "./pages/Home"; // Nueva página Home
import "./styles/styles.css"; // Ajusta la ruta si es necesario
import "./styles/custom.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./styles/Button.css";

export const App = () => {
  return (
    <Router>
      <InstrumentProvider>
        {/* El Header se muestra en todas las rutas */}
        <Header />
        <Routes>
          {/* Ruta principal para la Home */}
          <Route path="/" element={<Home />} />
          {/* Ruta adicional para el botón de registro (si se requiere) */}
          <Route path="/register" element={<RegisterInstrumentButton />} />
        </Routes>
      </InstrumentProvider>
    </Router>
  );
};
