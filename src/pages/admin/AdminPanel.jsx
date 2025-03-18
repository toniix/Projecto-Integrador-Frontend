import { useEffect, useState } from "react";
import { InstrumentForm } from "../../components/instrument/InstrumentForm";
import { ListProduct } from "./ListProduct";
import { ListUsers } from "./ListUsers";
import Button from "../../components/common/Button";
import { Home, Package, Calendar, Users, Plus, AlertTriangle, RefreshCw } from "lucide-react";
import "../../styles/AdminPanel.css";

export const AdminPanel = () => {
  const [view, setView] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [stats, setStats] = useState({
    products: "142",
    reservations: "38",
    users: "256",
    visits: "823"
  });

  useEffect(() => {
    const checkMobileDevice = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobileDevice();
    window.addEventListener("resize", checkMobileDevice);

    if (window.innerWidth < 1024) {
      alert("Este panel no está optimizado para dispositivos móviles.");
    }

    return () => {
      window.removeEventListener("resize", checkMobileDevice);
    };
  }, []);
  
  // Función para simular la actualización de datos
  const refreshData = async () => {
    setIsRefreshing(true);
    
    // Simulamos una petición a la API
    try {
      // Simulación de tiempo de carga
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Actualizar los datos con valores simulados
      // En un entorno real, aquí harías fetch a tu API
      const randomChange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
      
      setStats({
        products: String(parseInt(stats.products) + randomChange(-5, 5)),
        reservations: String(parseInt(stats.reservations) + randomChange(-3, 8)),
        users: String(parseInt(stats.users) + randomChange(0, 3)),
        visits: String(parseInt(stats.visits) + randomChange(10, 50)),
      });
      
      // Actualizar timestamp
      setLastUpdate(new Date());
      
      // Mostrar notificación
      setNotification({
        show: true,
        message: "Datos actualizados correctamente"
      });
      
      // Ocultar la notificación después de 3 segundos
      setTimeout(() => {
        setNotification({ show: false, message: "" });
      }, 3000);
      
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      setNotification({
        show: true,
        message: "Error al actualizar los datos. Intente más tarde."
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Componente de botón personalizado para la navegación del panel
  const SidebarButton = ({ onClick, icon, text, active }) => {
    const Icon = icon;
    
    return (
      <button
        onClick={onClick}
        className={`
          w-full flex items-center gap-3 rounded-xl transition-all duration-300 py-3 px-4
          ${active 
            ? "bg-[#730f06] text-white shadow-md" 
            : "bg-transparent text-[#d9c6b0] hover:bg-[#b08562]/20 hover:text-white"}
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

  // Tarjeta para la página de inicio
  const StatCard = ({ title, value, icon, color }) => {
    const Icon = icon;
    
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 border-l-4 hover:translate-y-[-5px] stat-card" style={{ borderLeftColor: color }}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[#757575] text-sm">{title}</p>
            <h3 className="text-2xl font-bold text-[#1e1e1e]">{value}</h3>
          </div>
          <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
            <Icon size={24} color={color} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-[280px_1fr] bg-[#F9F7F4] text-[#1e1e1e] pt-24 admin-background">
      {/* Panel de alerta para móviles */}
      {isMobile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e1e1e]/80 p-6">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <AlertTriangle size={48} className="text-[#730f06] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1e1e1e] mb-2">Vista no optimizada</h3>
            <p className="text-[#757575] mb-4">El panel de administración está diseñado para verse en pantallas más grandes.</p>
            <Button variant="primary" onClick={() => setIsMobile(false)}>
              Continuar de todos modos
            </Button>
          </div>
        </div>
      )}

      {/* Menú Lateral */}
      <aside className="bg-[#3B0012] text-white p-6 flex flex-col gap-4 shadow-lg admin-sidebar">
        <div className="flex items-center justify-center space-x-3 mb-8 border-b border-[#b08562] pb-4">
          <img src="/img/logo.png" alt="Logo" className="w-10 h-10" />
          <h3 className="text-xl font-bold text-[#d9c6b0] font-['Alata']">Admin Panel</h3>
        </div>
        
        <div className="flex flex-col gap-2">
          <SidebarButton 
            onClick={() => setView("home")}
            icon={Home}
            text="Dashboard"
            active={view === "home"}
          />
          
          <SidebarButton 
            onClick={() => setView("list")}
            icon={Package}
            text="Instrumentos"
            active={view === "list"}
          />
          
          <SidebarButton 
            onClick={() => setView("manage-reservations")}
            icon={Calendar}
            text="Reservas"
            active={view === "manage-reservations"}
          />
          
          <SidebarButton 
            onClick={() => setView("manage-users")}
            icon={Users}
            text="Usuarios"
            active={view === "manage-users"}
          />
        </div>
        
        <div className="mt-auto pt-4 border-t border-[#b08562]/30">
          <Button 
            variant="accent"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex items-center justify-center gap-2">
              <Plus size={18} />
              <span>Nuevo Instrumento</span>
            </div>
          </Button>
        </div>
        
        <InstrumentForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </aside>

      {/* Contenido */}
      <section className="p-6 bg-[#F9F7F4] overflow-y-auto">
        {view === "home" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-[#1e1e1e]">Dashboard</h1>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#757575]">
                  Última actualización: {lastUpdate.toLocaleTimeString()}
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => refreshData()}
                  disabled={isRefreshing}
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                    <span>{isRefreshing ? "Actualizando..." : "Actualizar datos"}</span>
                  </div>
                </Button>
              </div>
            </div>
            
            {/* Notificación de actualización */}
            {notification.show && (
              <div className="bg-[#d9c6b0] text-[#3e0b05] px-4 py-2 rounded-lg mb-4 flex items-center justify-between">
                <span>{notification.message}</span>
                <button 
                  onClick={() => setNotification({ ...notification, show: false })}
                  className="text-[#730f06] hover:text-[#3e0b05]"
                >
                  ×
                </button>
              </div>
            )}
            
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Instrumentos totales" value={stats.products} icon={Package} color="#730f06" />
              <StatCard title="Reservas activas" value={stats.reservations} icon={Calendar} color="#b08562" />
              <StatCard title="Usuarios registrados" value={stats.users} icon={Users} color="#3e0b05" />
              <StatCard title="Visitas hoy" value={stats.visits} icon={Home} color="#757575" />
            </div>
            
            {/* Panel central */}
            <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg admin-container">
              <h2 className="text-xl font-bold text-[#1e1e1e] mb-4 border-b border-[#d9c6b0] pb-2 admin-header">
                Bienvenido al Panel de Administración
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#F9F7F4] p-4 rounded-lg shadow-sm hover:shadow transition-all duration-300 cursor-pointer hover:translate-y-[-3px]">
                  <h3 className="font-semibold text-[#3e0b05]">Catálogo</h3>
                  <p className="text-sm text-[#757575]">Gestiona tu inventario de instrumentos</p>
                </div>
                <div className="bg-[#F9F7F4] p-4 rounded-lg shadow-sm hover:shadow transition-all duration-300 cursor-pointer hover:translate-y-[-3px]">
                  <h3 className="font-semibold text-[#3e0b05]">Reservas</h3>
                  <p className="text-sm text-[#757575]">Administra las solicitudes de alquiler</p>
                </div>
                <div className="bg-[#F9F7F4] p-4 rounded-lg shadow-sm hover:shadow transition-all duration-300 cursor-pointer hover:translate-y-[-3px]">
                  <h3 className="font-semibold text-[#3e0b05]">Usuarios</h3>
                  <p className="text-sm text-[#757575]">Visualiza los perfiles de clientes</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-[#3B0012]/10 rounded-lg border border-[#3B0012]/20">
                <h3 className="font-semibold text-[#3e0b05] mb-2">Acciones rápidas</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Nuevo instrumento
                  </Button>
                  <Button variant="secondary" onClick={() => setView("manage-reservations")}>
                    Ver reservas
                  </Button>
                  <Button variant="outline" onClick={() => setView("manage-users")}>
                    Gestionar usuarios
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {view === "list" && (
          <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4 border-b border-[#d9c6b0] pb-2">
              <h2 className="text-xl font-bold text-[#1e1e1e]">Catálogo de Instrumentos</h2>
              <Button 
                variant="primary"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Nuevo</span>
                </div>
              </Button>
            </div>
            <ListProduct />
          </div>
        )}
        
        {view === "manage-reservations" && (
          <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-xl font-bold text-[#1e1e1e] mb-4 border-b border-[#d9c6b0] pb-2">
              Gestión de Reservas
            </h2>
            <div className="p-8 text-center">
              <Calendar size={48} className="mx-auto text-[#b08562] mb-4" />
              <p className="text-[#757575]">Módulo de gestión de reservas en desarrollo.</p>
              <Button variant="outline" className="mt-4">
                Ver historial de reservas
              </Button>
            </div>
          </div>
        )}
        
        {view === "manage-users" && (
          <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-xl font-bold text-[#1e1e1e] mb-4 border-b border-[#d9c6b0] pb-2">
              Gestión de Usuarios
            </h2>
            <ListUsers />
          </div>
        )}
      </section>
    </main>
  );
};