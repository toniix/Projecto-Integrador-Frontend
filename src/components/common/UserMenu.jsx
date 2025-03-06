import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { UserCircle, LogOut, Settings, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

function UserMenu({ user, displayName, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Use email from token subject if available
  const userEmail = user?.email || user?.sub || "usuario@example.com";
  
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

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-[#d9c6b0] hover:text-[#b08562] transition-colors bg-[#730f06]/20 px-3 py-2 rounded-lg"
      >
        <UserCircle size={20} />
        <span className="font-medium">{displayName}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gradient-to-br from-[#3e0b05] to-[#2a0803] shadow-lg border border-[#ffffff08] py-2">
          <div className="px-4 py-2 border-b border-[#ffffff08]">
            <p className="font-medium text-sm text-[#d9c6b0]">{displayName}</p>
            <p className="text-xs text-[#d9c6b0] truncate mt-1">{userEmail}</p>
          </div>
          
          <div className="border-t border-[#b08562]/10">
            <Link 
              to="/profile" 
              className="flex items-center px-4 py-2.5 text-sm text-[#d9c6b0] hover:bg-[#b08562]/10 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} className="mr-2 text-[#d9c6b0]" />
              Mi perfil
            </Link>
            
            {user?.roles?.includes("ADMIN") && (
              <Link 
                to="/admin" 
                className="flex items-center px-4 py-2.5 text-sm text-[#d9c6b0] hover:bg-[#b08562]/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={16} className="mr-2 text-[#d9c6b0]" />
                Panel de administración
              </Link>
            )}
            
            <button 
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex items-center w-full text-left px-4 py-2.5 text-sm text-[#d9c6b0] hover:bg-[#b08562]/10 transition-colors"
            >
              <LogOut size={16} className="mr-2 text-[#d9c6b0]" />
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
  displayName: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default UserMenu;