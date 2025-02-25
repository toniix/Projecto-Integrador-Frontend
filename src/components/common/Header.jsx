import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import logoCandC from "/LogoC&C.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#1e1e1e] shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Name */}
          <div className="flex items-center space-x-3">
            <img src={logoCandC} alt="Logo" className="w-10 h-10" />
            <span className="text-[#d9c6b0] text-xl font-bold hidden sm:block">
              Clave &amp; Compas
            </span>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#d9c6b0] hover:text-[#b08562] transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:space-x-4">
            <button className="px-4 py-2 bg-[#730f06] text-white rounded-lg hover:bg-[#b08562] transition-colors">
              Iniciar Sesión
            </button>
            <button className="px-4 py-2 border-2 border-[#d9c6b0] text-[#d9c6b0] rounded-lg hover:bg-[#d9c6b0] hover:text-[#1e1e1e] transition-colors">
              Registrarse
            </button>
            {/* <button className=" custom-button">Crear Cuenta</button>
            <button className=" custom-button">Iniciar Sesión</button> */}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } sm:hidden border-t border-[#757575] py-4 space-y-3`}
        >
          <button className="w-full px-4 py-2 bg-[#730f06] text-white rounded-lg hover:bg-[#b08562] transition-colors">
            Iniciar Sesión
          </button>
          <button className="w-full px-4 py-2 border-2 border-[#d9c6b0] text-[#d9c6b0] rounded-lg hover:bg-[#d9c6b0] hover:text-[#1e1e1e] transition-colors">
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
