import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { LogOut, Settings, ChevronDown, Heart } from "lucide-react";
import { Link } from "react-router-dom";

function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  console.log(user);

  // Handle clicking outside to close the menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Get the initial of the user's first name
  const userInitial = user.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "";

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón principal mejorado con la paleta correcta */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2.5 rounded-xl 
          bg-gradient-to-r from-[#7a0715] to-[#3b0012]
          hover:from-[#8b1a28] hover:to-[#4d0018]
          text-[#e6b465] transition-all duration-300 
          shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c78418] to-[#7a0715] 
          flex items-center justify-center ring-2 ring-[#e6b465]/20 text-[#e6b465] font-bold"
        >
          {userInitial}
        </div>
        <span className="font-medium">{user.firstName}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menú desplegable mejorado con la paleta correcta */}
      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-56 rounded-xl 
          bg-gradient-to-b from-[#7a0715] to-[#3b0012]
          shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-[#ffffff15]
          backdrop-blur-sm transform transition-all duration-300 scale-100 origin-top-right
          divide-y divide-[#ffffff15]"
        >
          {/* Sección de información del usuario */}
          <div className="p-4">
            <p className="text-[#c78418] text-sm truncate mt-0.5">
              {user.email}
            </p>
          </div>

          {/* Enlaces y opciones */}
          <div className="p-2">
            <Link
              to="/favorites"
              className="flex items-center px-3 py-2.5 rounded-lg text-sm text-[#e6b465] 
                hover:bg-[#3d2130] transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <Heart
                size={16}
                className="mr-3 text-[#c78418] group-hover:text-[#e6b465] transition-colors"
              />
              Mis favoritos
            </Link>

            <Link
              to="/profile"
              className="flex items-center px-3 py-2.5 rounded-lg text-sm text-[#e6b465] 
                hover:bg-[#3d2130] transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <Settings
                size={16}
                className="mr-3 text-[#c78418] group-hover:text-[#e6b465] transition-colors"
              />
              Mi perfil
            </Link>

            {user?.roles?.includes("ADMIN") && (
              <Link
                to="/admin"
                className="flex items-center px-3 py-2.5 rounded-lg text-sm text-[#e6b465] 
                  hover:bg-[#3d2130] transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <Settings
                  size={16}
                  className="mr-3 text-[#c78418] group-hover:text-[#e6b465] transition-colors"
                />
                Panel de administración
              </Link>
            )}
          </div>

          {/* Botón de cerrar sesión */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm text-[#e6b465] 
                hover:bg-[#7a0715] transition-all duration-300 group
                hover:shadow-lg hover:scale-[1.02]"
            >
              <LogOut
                size={18}
                className="mr-3 text-[#c78418] group-hover:text-[#e6b465] transition-colors"
              />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

UserMenu.propTypes = {
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default UserMenu;
