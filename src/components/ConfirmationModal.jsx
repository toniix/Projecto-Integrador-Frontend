import React from "react";
import { X, AlertTriangle } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm, //FUNCION DE LA LOGICA DE ELIMINACION
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0d0d0d]/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#d9c6b0] rounded-lg w-full max-w-md relative shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#8c3a27] hover:text-[#d95a4e] transition-colors"
        >
          <X size={24} />
        </button>

        {/* Modal content */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#d95a4e]/10 p-2 rounded-full">
              <AlertTriangle size={24} className="text-[#d95a4e]" />
            </div>
            <h2 className="text-[#8c3a27] text-xl font-semibold">
              Confirma eliminación de instrumento
            </h2>
          </div>

          <p className="text-[#0d0d0d] mb-6">
            ¿Estás seguro que deseas eliminar este instrumento? Esta acción no
            se puede deshacer.
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-[#a68f72] text-white hover:bg-[#8c3a27] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 rounded-md bg-[#d95a4e] text-white hover:bg-[#8c3a27] transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
