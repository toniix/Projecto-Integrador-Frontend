import { useEffect, useState } from "react";
import { InstrumentForm } from "../../components/instrument/InstrumentForm";
import { ListProduct } from "./ListProduct";
import "../../styles/AdminPanel.css"

export const AdminPanel = () => {
  const [view, setView] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      alert("Este panel no está disponible en dispositivos móviles.");
    }
  }, []);

  return (
    <main className="min-h-screen grid grid-cols-[250px_1fr] bg-[#f1eae7] text-[#1e1e1e]">
      {/* Menú Lateral */}
      <aside className="bg-[#3e0b05] text-white p-6 flex flex-col gap-4 shadow-lg">
        <h3 className="text-xl text-center font-bold text-[#d9c6b0]">Panel de Administración</h3>
        <InstrumentForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <button className="btn-admin" onClick={() => setIsModalOpen(true)}>Agregar Producto</button>
        <button className="btn-admin" onClick={() => setView("list")}>Listar Instrumentos</button>
        <button className="btn-admin" onClick={() => setView("manage-reservations")}>Gestionar Reservas</button>
        <button className="btn-admin" onClick={() => setView("manage-users")}>Gestionar Usuarios</button>
      </aside>

      {/* Contenido */}
      <section className="p-6">
        {view === "home" && (
          <div className="flex flex-col items-center text-center">
            <img src="/img/logo.png" alt="Logo de la App" className="w-60 mx-auto mt-20 mb-4" />
            <h1 className="text-2xl font-bold text-[#730f06]">Bienvenido a AdminPanel</h1>
          </div>
        )}
        {view === "list" && (
          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-4">Lista de Instrumentos</h3>
            <ListProduct />
          </div>
        )}
        {view === "manage-reservations" && (
          <h3 className="text-xl font-semibold text-[#1e1e1e]">Gestión de Reservas</h3>
        )}
        {view === "manage-users" && (
          <h3 className="text-xl font-semibold text-[#1e1e1e]">Gestión de Usuarios</h3>
        )}
      </section>
    </main>
  );
};
