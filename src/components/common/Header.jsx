import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo1 from "/img/logo1.svg";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#3e0b05] shadow-[0_2px_15px_-3px_rgba(115,15,6,0.2)] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Name */}
          <Link to={"/"} className="group flex items-center space-x-3 transition-transform duration-300 hover:-translate-y-0.5">
          <div className="flex items-center space-x-3">
            <img src={Logo1} alt="Logo" className="w-10 h-10" />
            <span className="text-[#b08562] text-xl font-bold hidden sm:block">
              Clave &amp; Compas
            </span>
          </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#d9c6b0] hover:text-[#b08562] transition-colors p-2 rounded-lg hover:bg-[#730f06]/20"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:space-x-6">
            <button className="px-4 py-2 bg-[#b08562] text-[#d9c6b0] rounded-lg hover:bg-[#730f06] transition-colors">
              Iniciar Sesión
            </button>
            <button className="px-4 py-2 border-2 border-[#d9c6b0] text-[#d9c6b0] rounded-lg hover:bg-[#d9c6b0] hover:text-[#730f06] transition-colors">
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
          <button className="w-full px-4 py-2 border-2 border-[#d9c6b0] text-[#d9c6b0] rounded-lg hover:bg-[#d9c6b0] hover:text-[#730f06] transition-colors">
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
