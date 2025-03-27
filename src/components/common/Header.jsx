import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "/img/logo_white.png";
import Button from "./Button";
import LoginModal from "../user/login/LoginModal";
import { useAuth } from "../../context";
import UserMenu from "./UserMenu";
import RegisterModal from "../user/register/RegisterModal";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  const openRegisterModal = () => {
    setIsLoginModalOpen(false); // Cerrar el modal de login
    setIsRegisterModalOpen(true); // Abrir el modal de registro
  };

  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openLoginModal = () => {
    setIsRegisterModalOpen(false); // Cerrar el modal de registro
    setIsLoginModalOpen(true); // Abrir el modal de login
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-[#3B0012]/95 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo and Name */}
            <Link
              to={"/"}
              className="group flex items-center space-x-3 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center space-x-3">
                <img src={logo} alt="Logo" className="w-12 h-12" />
                <span className="text-[#ffffff] text-xl hidden sm:block font-['Alata']">
                  Clave&amp;Compás
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
            <div className="hidden sm:flex sm:items-center sm:space-x-6">
              {isAuthenticated ? (
                <UserMenu user={user} onLogout={logout} />
              ) : (
                <>
                  <Button onClick={openRegisterModal} variant="secondary">
                    Registrarse
                  </Button>
                  <Button onClick={openLoginModal} variant="primary">
                    Iniciar Sesión
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } sm:hidden border-t border-[#757575] py-4 space-y-3`}
          >
            {isAuthenticated ? (
              <div className="px-4">
                <UserMenu user={user} onLogout={logout} />
              </div>
            ) : (
              <>
                <Button onClick={openLoginModal}>Iniciar Sesión</Button>
                <Button onClick={openRegisterModal}>Registrarse</Button>
              </>
            )}
          </div>
        </div>
      </header>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        openRegisterModal={openRegisterModal}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        openLoginModal={openLoginModal} // Pasar función para abrir el modal de login
      />
    </>
  );
}

export default Header;
