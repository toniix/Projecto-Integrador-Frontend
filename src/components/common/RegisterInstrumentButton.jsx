import { useState } from "react";
import { InstrumentForm } from "../instrument/InstrumentForm";

export const RegisterInstrumentButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-[#730f06] text-white rounded-lg hover:bg-[#b08562] transition-colors"
      >
        Registrar Nuevo Instrumento
      </button>
      <InstrumentForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
