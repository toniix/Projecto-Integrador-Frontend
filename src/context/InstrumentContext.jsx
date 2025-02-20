import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

const InstrumentContext = createContext();

const InstrumentProvider = ({ children }) => {
  const [instruments, setInstruments] = useState([]);


  const addInstrument = (instrument) => {
    setInstruments([...instruments, instrument]);
  };

  return (
    <InstrumentContext.Provider value={{ instruments, addInstrument }}>
      {children}
    </InstrumentContext.Provider>
  );
};

export { InstrumentContext, InstrumentProvider };

InstrumentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};