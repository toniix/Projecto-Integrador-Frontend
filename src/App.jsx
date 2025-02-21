<<<<<<< HEAD

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { InstrumentProvider } from "./context/InstrumentContext";
import { RegisterInstrumentButton } from "./components/common/RegisterInstrumentButton";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import './styles/Button.css'

=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { InstrumentProvider } from "./context/InstrumentContext";
import { RegisterInstrumentButton } from "./components/common/RegisterInstrumentButton";
import FullGallery from "./components/imagegalery/FullGallery";
import ProductDetail from "./pages/ProductDetail"
import Header from "./components/common/Header"; // Nuevo Header
import Home from "./pages/Home"; // Nueva página Home
import "./styles/styles.css"; // Ajusta la ruta si es necesario
import "./styles/custom.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./styles/Button.css";
>>>>>>> 57da30bd5aa574ac5ed374f19f5bd975096a3544

export const App = () => {
  return (
    <Router>
      <InstrumentProvider>
<<<<<<< HEAD
        <Routes>
          <Route path="/" element={<RegisterInstrumentButton/>} />
        </Routes>
      </InstrumentProvider>
    </Router>
  )
}
=======
        {/* El Header se muestra en todas las rutas */}
        <Header />
        <Routes>
          {/* Ruta principal para la Home */}
          <Route path="/" element={<Home />} />
          {/* Ruta adicional para el botón de registro (si se requiere) */}
          <Route path="/register" element={<RegisterInstrumentButton />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/product/:id/galeria" element={<FullGallery />} />
        </Routes>
      </InstrumentProvider>
    </Router>
  );
};
>>>>>>> 57da30bd5aa574ac5ed374f19f5bd975096a3544
