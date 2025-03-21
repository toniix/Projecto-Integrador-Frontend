// Componente de botón personalizado para la navegación del panel
const SidebarButton = ({ onClick, icon, text, active }) => {
  const Icon = icon;

  return (
    <button
      onClick={onClick}
      className={`
          w-full flex items-center gap-3 rounded-xl transition-all duration-300 py-3 px-4
          ${
            active
              ? "bg-[#730f06] text-white shadow-md"
              : "bg-transparent text-[#d9c6b0] hover:bg-[#b08562]/20 hover:text-white"
          }
          font-medium relative overflow-hidden
          hover:translate-y-[-2px] active:translate-y-0
          admin-btn
        `}
    >
      <Icon size={18} />
      <span>{text}</span>
    </button>
  );
};

export default SidebarButton;
