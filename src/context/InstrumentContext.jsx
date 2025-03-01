import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

const InstrumentContext = createContext();

const InstrumentProvider = ({ children }) => {
  const [instruments, setInstruments] = useState([]);


  const addInstrument = (instrument) => {
    setInstruments([...instruments, instrument]);
  };

  // Añadimos la función para actualizar un instrumento
  const updateInstrument = (updatedInstrument) => {
    setInstruments(
      instruments.map((instrument) => 
        instrument.id === updatedInstrument.id ? updatedInstrument : instrument
      )
    );
  };
  
  // Opcionalmente, añadimos también la función para eliminar un instrumento
  const removeInstrument = (id) => {
    setInstruments(instruments.filter(instrument => instrument.id !== id));
  };

  return (
    <InstrumentContext.Provider value={{ 
      instruments, 
      setInstruments,
      addInstrument,
      updateInstrument, 
      removeInstrument 
       }}>
      {children}
    </InstrumentContext.Provider>
  );
};

export { InstrumentContext, InstrumentProvider };

InstrumentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};