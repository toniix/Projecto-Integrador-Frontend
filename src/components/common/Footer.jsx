import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo1 from "/img/logo1.svg";
import Button from "./Button";

function Footer() {
  //const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <footer className="bottom-0 left-0 right-0 bg-[#3e0b05] shadow-[0_-2px_15px_-3px_rgba(115,15,6,0.2)] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-start h-20">
                {/* Logo and Name */}
                <Link to={"/"} className="group flex items-center space-x-3 transition-transform duration-300 hover:-translate-y-0.5">
                    <div className="flex items-center space-x-3">
                        <img src={Logo1} alt="Logo" className="w-10 h-10" />
                        <span className="text-[#b08562] hidden sm:block">
                        Clave & Compas © 2025 <br />
                        Todos los derechos reservados.
                        </span> {/* Añadir el texto al lado del logo */}
                    </div>
                </Link>
            </div>
        </div>
    </footer>
  );
}

//Responsive
//Crear rama
//Push de la rama
//Merge a dev??? Consultar antes

export default Footer;