import React, { useState } from "react";
import { LogOut, User, Settings } from "lucide-react";

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[#730f06]/20 transition-all duration-200"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#730f06] to-[#3e0b05] flex items-center justify-center text-[#d9c6b0] font-medium border border-[#ffffff15]">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-[#d9c6b0] hidden sm:block">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gradient-to-br from-[#3e0b05] to-[#2a0803] shadow-lg border border-[#ffffff08] py-2">
          <div className="px-4 py-2 border-b border-[#ffffff08]">
            <p className="text-sm text-[#d9c6b0]">{user.email}</p>
          </div>

          <button className="w-full px-4 py-2 text-left text-[#9e9e9e] hover:text-[#d9c6b0] hover:bg-[#730f06]/20 flex items-center space-x-2 transition-colors">
            <User size={16} />
            <span>Perfil</span>
          </button>

          <button className="w-full px-4 py-2 text-left text-[#9e9e9e] hover:text-[#d9c6b0] hover:bg-[#730f06]/20 flex items-center space-x-2 transition-colors">
            <Settings size={16} />
            <span>Configuración</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-left text-[#9e9e9e] hover:text-[#d9c6b0] hover:bg-[#730f06]/20 flex items-center space-x-2 transition-colors"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
