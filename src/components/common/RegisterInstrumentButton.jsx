import { useState } from 'react';
import { InstrumentForm } from '../instrument/InstrumentForm';
import { Button } from 'react-bootstrap';

export const RegisterInstrumentButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="text-center mt-5">
            <Button className="custom-button" onClick={() => setIsModalOpen(true)}>
                Agregar Instrumento
            </Button>
            <InstrumentForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

