import React, { useState } from "react";
import * as lucideIcons from "lucide-react";

const IconSelector=()=> {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("");
  
    const iconNames = Object.keys(lucideIcons);
  
    return (
      <div className="relative">
        {/* Botón para abrir modal */}
        <button
          className="flex items-center px-4 py-2 border rounded-lg shadow-md bg-white hover:bg-gray-100"
          onClick={() => setIsOpen(true)}
        >
          {selectedIcon!="" ? (
            <>
              {/*{React.createElement(lucideIcons[selectedIcon], { size: 20 })}*/}
             
              <span className="ml-2">{selectedIcon}</span>
            </>
          ) : (
            "Seleccionar Icono"
          )}
        </button>
  
        {/* Modal (se muestra si isOpen = true) */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-5 w-96 max-h-[70vh] overflow-y-auto">
              {/* Título y botón de cerrar */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Selecciona un Icono</h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-600">
                  ✖
                </button>
              </div>
  
              {/* Input de búsqueda */}
              <input
                type="text"
                placeholder="Buscar icono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-3"
              />
  
              {/* Lista de iconos */}
              <div className="grid grid-cols-4 gap-2">
                {iconNames.map((name) => {
                  const IconComponent = lucideIcons[name];
                  return (
                    <button
                      key={name}
                      className="flex flex-col items-center p-2 border rounded-lg hover:bg-gray-200"
                      onClick={() => {
                        setSelectedIcon(name);
                        
                        setIsOpen(false);
                      }}
                    >
                      <IconComponent size={24} />
                      <span className="text-xs">{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
  
        {/* Input oculto con el nombre del icono seleccionado */}
        <input type="hidden" name="icono" value={selectedIcon} />
      </div>
    );
}

export default IconSelector;