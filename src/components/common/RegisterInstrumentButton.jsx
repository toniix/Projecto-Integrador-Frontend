import { useState } from 'react';
import { InstrumentForm } from '../instrument/InstrumentForm';
import { Button } from 'react-bootstrap';

export const RegisterInstrumentButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="mt-5 add-button">
            <Button className="custom-button" onClick={() => setIsModalOpen(true)}>
                Agregar Producto
            </Button>
            <InstrumentForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};
