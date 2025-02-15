
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { InstrumentProvider } from "./context/InstrumentContext";
import { RegisterInstrumentButton } from "./components/common/RegisterInstrumentButton";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'


export const App = () => {
  return (
    <Router>
      <InstrumentProvider>
        <Routes>
          <Route path="/" element={<RegisterInstrumentButton/>} />
        </Routes>
      </InstrumentProvider>
    </Router>
  )
}