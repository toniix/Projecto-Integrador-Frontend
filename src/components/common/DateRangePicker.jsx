// src/components/common/DateRangePicker.jsx
import { useState, forwardRef, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Calendar } from 'lucide-react';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/DatepickerCustom.css'; 

// Registrar el idioma español
registerLocale('es', es);

// Input personalizado para el DatePicker
const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div 
    className="relative h-10 cursor-pointer"
    onClick={onClick}
    ref={ref}
  >
    <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#730f06]" />
    <div className="flex items-center h-full pl-10 pr-4 rounded-lg border border-gray-300 hover:border-[#b08562] transition-colors">
      <span className={value ? "text-[#1e1e1e]" : "text-gray-400"}>
        {value || placeholder}
      </span>
    </div>
  </div>
));

CustomInput.displayName = 'CustomInput';

const DateRangePicker = ({ 
  startDate, 
  endDate, 
  onChange, 
  placeholder = "Selecciona fechas disponibles"
}) => {
  const [dateRange, setDateRange] = useState([startDate, endDate]);

  useEffect(() => {
    setDateRange([startDate, endDate]);
  }, [startDate, endDate]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (onChange) {
      onChange(dates);
    }
  };

  return (
    <DatePicker
      selected={dateRange[0]}
      onChange={handleDateChange}
      startDate={dateRange[0]}
      endDate={dateRange[1]}
      selectsRange
      monthsShown={2}
      placeholderText={placeholder}
      locale="es"
      dateFormat="dd/MM/yyyy"
      customInput={<CustomInput placeholder={placeholder} />}
      popperClassName="datepicker-popper"
      inline={false}
      fixedHeight
    />
  );
};

export default DateRangePicker;