// src/common/Header.jsx
import { Link } from "react-router-dom";
// Si deseas usar la imagen del logo que está en public, puedes referenciarla directamente:
//import Logo from "/LogoC&C.png"; // Vite permite usar la ruta absoluta desde /public

function Header() {
  return (
    <header>
      <div className="logo">
        <Link to="/">
          {/* Usamos el import "Logo" o también puedes usar src="/LogoC&C.png" */}
          <img src="/img/logo.png" alt="Logo de la empresa" />
          <span>Clave &amp; Compas</span>
        </Link>
      </div>
      <div className="auth-buttons">
        <button className=" custom-button">Crear Cuenta</button>
        <button className=" custom-button">Iniciar Sesión</button>
      </div>
    </header>
  );
}

export default Header;
