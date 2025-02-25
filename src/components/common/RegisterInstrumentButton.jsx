import { useState } from 'react';
import { InstrumentForm } from '../instrument/InstrumentForm';

export const RegisterInstrumentButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div >
            <button className="admin-button" onClick={() => setIsModalOpen(true)} >
                Agregar Producto
            </button>
            <InstrumentForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

