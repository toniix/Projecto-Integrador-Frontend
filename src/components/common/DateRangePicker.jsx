// src/components/common/DateRangePicker.jsx
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'lucide-react';

const DateRangePicker = ({ 
  onChange, 
  placeholder = "Selecciona fechas",
  excludedDates = [],
  startDate: externalStartDate, // Renombrado para claridad
  endDate: externalEndDate     // Renombrado para claridad
}) => {
  // Estados para manejar las fechas y la UI
  const [isOpen, setIsOpen] = useState(false);
  // Usar los valores externos como valores iniciales
  const [startDate, setStartDate] = useState(externalStartDate);
  const [endDate, setEndDate] = useState(externalEndDate);
  const [hoveredDate, setHoveredDate] = useState(null);
  const calendarRef = useRef(null);

  // Sincronizar el estado interno con las props externas
  useEffect(() => {
    setStartDate(externalStartDate);
    setEndDate(externalEndDate);
  }, [externalStartDate, externalEndDate]);

  // Obtener fecha actual
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Configuración inicial del primer mes (mes actual)
  const [firstMonth, setFirstMonth] = useState({
    month: today.getMonth(),
    year: today.getFullYear()
  });

  // Calcular el segundo mes (mes siguiente)
  const getSecondMonth = () => {
    const nextMonth = new Date(firstMonth.year, firstMonth.month + 1, 1);
    return {
      month: nextMonth.getMonth(),
      year: nextMonth.getFullYear()
    };
  };

  // Días de la semana en español
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Nombres de los meses en español
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Cerrar el calendario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Obtener número de días en un mes
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Obtener el día de la semana en que empieza el mes (0: lunes, 6: domingo)
  const getFirstDayOfMonth = (year, month) => {
    // Ajustar para que la semana comience en lunes (0 = lunes, 6 = domingo)
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  // Formatear fecha como string YYYY-MM-DD
  const formatDateString = (day, month, year) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Verificar si una fecha está en el pasado
  const isPastDate = (day, month, year) => {
    const date = new Date(year, month, day);
    return date < today;
  };

  // Verificar si una fecha está excluida
  const isExcludedDate = (day, month, year) => {
    if (!excludedDates.length) return false;
    
    const dateStr = formatDateString(day, month, year);
    return excludedDates.some(excludedDate => {
      const excludedStr = formatDateString(
        excludedDate.getDate(),
        excludedDate.getMonth(),
        excludedDate.getFullYear()
      );
      return dateStr === excludedStr;
    });
  };

  // Verificar si es la fecha actual
  const isToday = (day, month, year) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // Verificar si una fecha está seleccionada como inicio o fin
  const isStartOrEndDate = (day, month, year) => {
    if (!startDate && !endDate) return false;
    
    const dateStr = formatDateString(day, month, year);
    
    const start = startDate ? formatDateString(
      startDate.getDate(), 
      startDate.getMonth(), 
      startDate.getFullYear()
    ) : null;
    
    const end = endDate ? formatDateString(
      endDate.getDate(), 
      endDate.getMonth(), 
      endDate.getFullYear()
    ) : null;
    
    return dateStr === start || dateStr === end;
  };

  // Verificar si una fecha está en el rango seleccionado
  const isInRange = (day, month, year) => {
    if (!startDate || (!endDate && !hoveredDate)) return false;
    
    const date = new Date(year, month, day);
    const start = startDate;
    const end = endDate || hoveredDate;
    
    return date > start && date < end;
  };

  // Generar la matriz del calendario para un mes dado
  const generateCalendarGrid = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Crear una matriz para las semanas del mes
    let calendar = [];
    let week = [];
    
    // Agregar espacios en blanco para los días anteriores al primer día del mes
    for (let i = 0; i < firstDay; i++) {
      week.push(null);
    }
    
    // Agregar los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ day, month, year });
      
      // Si la semana está completa o es el último día del mes, agregar la semana al calendario
      if (week.length === 7 || day === daysInMonth) {
        // Completar la última semana con espacios en blanco si es necesario
        while (week.length < 7) {
          week.push(null);
        }
        
        calendar.push(week);
        week = [];
      }
    }
    
    return calendar;
  };

  // Manejar clic en un día
  const handleDayClick = (day, month, year) => {
    if (!day || isPastDate(day, month, year) || isExcludedDate(day, month, year)) {
      return;
    }
    
    const clickedDate = new Date(year, month, day);
    
    if (!startDate || (startDate && endDate) || clickedDate < startDate) {
      // Iniciar nueva selección
      setStartDate(clickedDate);
      setEndDate(null);
      setHoveredDate(null);
    } else {
      // Completar rango
      setEndDate(clickedDate);
      setHoveredDate(null);
    }
  };

  // Manejar hover sobre un día
  const handleDayHover = (day, month, year) => {
    if (!day || !startDate || endDate) return;
    
    setHoveredDate(new Date(year, month, day));
  };

  // Navegar al mes anterior
  const goToPreviousMonth = () => {
    setFirstMonth(prev => {
      const prevMonth = prev.month - 1;
      if (prevMonth < 0) {
        return { month: 11, year: prev.year - 1 };
      }
      return { month: prevMonth, year: prev.year };
    });
  };

  // Navegar al mes siguiente
  const goToNextMonth = () => {
    setFirstMonth(prev => {
      const nextMonth = prev.month + 1;
      if (nextMonth > 11) {
        return { month: 0, year: prev.year + 1 };
      }
      return { month: nextMonth, year: prev.year };
    });
  };

  // Aplicar la selección
  const handleApply = () => {
    if (startDate && endDate && onChange) {
      onChange([startDate, endDate]);
    }
    setIsOpen(false);
  };

  // Cancelar la selección
  const handleCancel = () => {
    setIsOpen(false);
  };

  // Formatear fecha para mostrar
  const formatDateDisplay = (date) => {
    if (!date) return '';
    
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Texto a mostrar en el input
  const displayText = startDate && endDate
    ? `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}`
    : placeholder;

  // Determinar si el botón Aplicar debe estar habilitado
  const canApply = startDate && endDate;

  // El segundo mes es siempre el siguiente al primero
  const secondMonth = getSecondMonth();

    // Renderizar un día del calendario
  const renderDay = (dayInfo, monthIndex) => {
    if (!dayInfo) {
      return (
        <div 
          key={`empty-${monthIndex}`} 
          className="w-8 h-8"
        ></div>
      );
    }
    
    const { day, month, year } = dayInfo;
    const isDisabled = isPastDate(day, month, year) || isExcludedDate(day, month, year);
    const isSelected = isStartOrEndDate(day, month, year);
    const isRangeDay = isInRange(day, month, year);
    const isTodayDate = isToday(day, month, year);
    
    // Definir clases para estilos
    let dayClass = "w-8 h-8 flex items-center justify-center text-xs transition-colors duration-300";
    
    if (isDisabled) {
      dayClass += ' text-gray-300 cursor-not-allowed';
    } else if (isSelected) {
      dayClass += ' bg-[#730f06] text-white rounded-full cursor-pointer hover:bg-[#3e0b05]';
    } else if (isRangeDay) {
      dayClass += ' bg-[#b08562]/30 text-[#3e0b05] cursor-pointer hover:bg-[#b08562]/50';
    } else if (isTodayDate) {
      dayClass += ' border border-[#b08562] bg-[#F9F7F4] rounded-full cursor-pointer hover:bg-[#d9c6b0]';
    } else {
      dayClass += ' text-[#1e1e1e] cursor-pointer hover:bg-[#d9c6b0] hover:rounded-full';
    }
    
    return (
      <div
        key={`day-${day}-${month}-${year}`}
        className={dayClass}
        onClick={() => handleDayClick(day, month, year)}
        onMouseEnter={() => handleDayHover(day, month, year)}
      >
        {day}
      </div>
    );
  };

  // Renderizar un mes completo
  const renderMonth = (year, month, isSecondMonth) => {
    const calendar = generateCalendarGrid(year, month);
    
    return (
      <div className="calendar-month">
        {/* Encabezado del mes con año debajo */}
        <div className="flex justify-between items-center mb-2">
          {!isSecondMonth ? (
            <button 
              onClick={goToPreviousMonth}
              className="p-1 text-[#3e0b05] hover:bg-gray-100 rounded-full transition-colors duration-300"
              type="button"
              aria-label="Mes anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : (
            <div className="w-6">{/* Espacio para mantener alineación */}</div>
          )}
          
          <div className="text-center">
            <h3 className="text-[#1e1e1e] font-medium text-sm mb-0.5">{monthNames[month]}</h3>
            <p className="text-xs text-gray-500">{year}</p>
          </div>
          
          {isSecondMonth ? (
            <button 
              onClick={goToNextMonth}
              className="p-1 text-[#3e0b05] hover:bg-gray-100 rounded-full transition-colors duration-300"
              type="button"
              aria-label="Mes siguiente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ) : (
            <div className="w-6">{/* Espacio para mantener alineación */}</div>
          )}
        </div>
        
        {/* Días de la semana */}
        <div className="grid grid-cols-7 mb-1">
          {weekDays.map((day, i) => (
            <div key={day} className="w-8 h-8 flex items-center justify-center text-xs text-[#757575]">
              {day.substring(0, 1)}
            </div>
          ))}
        </div>
        
        {/* Días del mes */}
        <div className="calendar-grid">
          {calendar.map((week, weekIndex) => (
            <div key={`week-${weekIndex}-${month}`} className="grid grid-cols-7 mb-1">
              {week.map((day, dayIndex) => renderDay(day, `${weekIndex}-${dayIndex}-${month}`))}
            </div>
          ))}
        </div>
        
        {/* No mostrar etiquetas del mes dentro del calendario */}
        {/* La etiqueta se mostrará en la parte inferior del componente */}
      </div>
    );
  };

  return (
    <div className="relative" ref={calendarRef}>
      {/* Input para mostrar las fechas seleccionadas */}
      <div 
        className="flex items-center relative cursor-pointer border border-gray-300 rounded-lg px-4 py-2 hover:border-[#b08562] transition-colors duration-300 focus-within:ring-2 focus-within:ring-[#730f06]/30 focus-within:border-[#730f06]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[#730f06] mr-3">
          <Calendar size={20} />
        </span>
        <span className={startDate && endDate ? 'text-[#1e1e1e]' : 'text-gray-400'}>
          {displayText}
        </span>
      </div>
      
      {/* Panel del calendario */}
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-md border border-gray-200 w-[580px] overflow-hidden">
          {/* Contenedor de calendarios */}
          <div className="p-4 flex flex-row space-x-6">
            {/* Primer mes (actual) */}
            <div className="flex-1">
              {renderMonth(firstMonth.year, firstMonth.month, false)}
            </div>
            
            {/* Segundo mes (siguiente) */}
            <div className="flex-1">
              {renderMonth(secondMonth.year, secondMonth.month, true)}
            </div>
          </div>
          
          {/* Etiquetas de inicio y fin fuera del calendario */}
          <div className="px-5 pb-3 flex justify-between">
            <div className="text-xs font-medium text-[#730f06]">
              Fecha de inicio
            </div>
            <div className="text-xs font-medium text-[#730f06]">
              Fecha de fin
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex border-t border-gray-200">
            <button
              className="flex-1 px-4 py-2 text-center text-[#1e1e1e] text-sm transition-colors duration-300 hover:bg-gray-50"
              onClick={handleCancel}
              type="button"
            >
              Cancelar
            </button>
            <button
              className={`flex-1 px-4 py-2 text-center text-white text-sm font-medium transition-colors duration-300 ${
                canApply 
                  ? 'bg-[#730f06] hover:bg-[#3e0b05]' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={canApply ? handleApply : undefined}
              disabled={!canApply}
              type="button"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

DateRangePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  excludedDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date)
};

export default DateRangePicker;