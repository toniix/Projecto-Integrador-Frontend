// src/common/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
// Si deseas usar la imagen del logo que está en public, puedes referenciarla directamente:
import Logo from "/LogoC&C.png"; // Vite permite usar la ruta absoluta desde /public

function Header() {
  return (
    <header>
      <div className="logo">
        <Link to="/">
          {/* Usamos el import "Logo" o también puedes usar src="/LogoC&C.png" */}
          <img src="/public/img/logo.png" alt="Logo de la empresa" />
          <span>Clave &amp; Compas</span>
        </Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/productos">Productos</Link>
          </li>
          <li>
            <Link to="/contacto">Contacto</Link>
          </li>
        </ul>
      </nav>
      <div className="auth-buttons">
        <button className="btn-crear">Crear Cuenta</button>
        <button className="btn-iniciar">Iniciar Sesión</button>
      </div>
    </header>
  );
}

export default Header;
