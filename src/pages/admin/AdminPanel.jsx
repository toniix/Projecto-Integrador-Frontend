import { useEffect, useState } from "react";
import { InstrumentForm } from "../../components/instrument/InstrumentForm";
import { ListProduct } from "./ListProduct";
import "../../styles/AdminPanel.css";

export const AdminPanel = () => {
  const [view, setView] = useState("home"); // Vista inicial con el logo
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 1024) {
      alert("Este panel no está disponible en dispositivos móviles.");
      return;
    }
  }, []);

  return (
    <main className="admin-panel">
      <aside className="admin-menu">
        <h3>Panel de Administración</h3>
        <InstrumentForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <button onClick={() => setIsModalOpen(true)}>Agregar Producto</button>
        <button onClick={() => setView("list")}>Listar Instrumentos</button>
        <button onClick={() => setView("manage-reservations")}>
          Gestionar Reservas
        </button>
        <button onClick={() => setView("manage-users")}>
          Gestionar Usuarios
        </button>
      </aside>
      <section className="admin-content">
        {view === "home" && ( // Vista por defecto con logo y nombre
          <div className="home-view">
            <img
              src="/img/logo.png"
              alt="Logo de la App"
              className="panel-logo"
            />
            <h1>Bienvenido a AdminPanel</h1>
          </div>
        )}
        {view === "list" && (
          <div>
            <h3 className="title-lista">Lista de Instrumentos</h3>{" "}
            {/* Encabezado pregunta*/}
            <ListProduct />
          </div>
        )}
        {view === "manage-reservations" && <h3>Gestión de Reservas</h3>}
        {view === "manage-users" && <h3>Gestión de Usuarios</h3>}
      </section>
    </main>
  );
};
