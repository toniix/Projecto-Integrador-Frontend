import React, { useEffect, useState } from "react";
import * as lucideIcons from "lucide-react";
import icons from "../../services/iconos.json";
import Button from "../common/Button";

// Componente reutilizable para cada icono
const IconCard = ({ iconName, onSelect }) => {
  const IconComponent = lucideIcons[iconName];

  return (
    <div
      className="flex flex-col items-center p-2 border rounded-lg hover:bg-gray-200 cursor-pointer transition"
      onClick={() => onSelect(iconName)}
      title={iconName}
      aria-label={`Seleccionar icono ${iconName}`}
    >
      {IconComponent ? React.createElement(IconComponent, { size: 24 }) : "❓"}
      
    </div>
  );
};

const IconSelector = ({onSelect}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [iconNames, setIconNames] = useState([]);

  useEffect(() => {
    setIconNames(icons.icons || []);
  }, []);

  // Filtrar iconos en base al texto de búsqueda
  const filteredIcons = iconNames.filter((icon) =>
    icon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Botón para abrir modal */}
      <Button
      variant="primary"
        onClick={() => setIsOpen(true)}
        aria-label="Seleccionar icono"
      >
        {selectedIcon ? (
          <span title={selectedIcon} className="flex items-center gap-2">
            {lucideIcons[selectedIcon] && React.createElement(lucideIcons[selectedIcon], { size: 20 })}
            <span className="truncate max-w-[100px]">{selectedIcon}</span>
          </span>
        ) : (
          "Seleccionar Icono"
        )}
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-5 w-96 max-h-[70vh] overflow-y-auto">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Selecciona un Icono</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-red-600 transition"
                aria-label="Cerrar modal"
              >
                ✖
              </button>
            </div>

            {/* Input de búsqueda */}
            <input
              type="text"
              placeholder="Buscar icono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Lista de iconos */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {filteredIcons.length > 0 ? (
                filteredIcons.map((icon) => (
                  <IconCard key={icon.name} iconName={icon.name} onSelect={(name) => {
                    setSelectedIcon(name);
                    onSelect(name)
                    setIsOpen(false);
                  }} />
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-4">No se encontraron iconos</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input oculto con el icono seleccionado */}
      <input type="hidden" name="icono" value={selectedIcon} />
    </div>
  );
};

export default IconSelector;
