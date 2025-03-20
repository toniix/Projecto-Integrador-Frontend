// src/components/common/DateRangePicker.jsx
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

// Agregar estilos globales para forzar los bordes redondeados
const addGlobalStyles = () => {
  const styleId = 'date-range-picker-styles';
  
  // Evitar duplicar los estilos si ya existen
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* Asegurar que las fechas del rango tengan bordes redondeados */
    .calendar-grid [class*="bg-[#e6b465]"] {
      border-radius: 9999px !important;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideIn {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
    
    .animate-slideIn {
      animation: slideIn 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
};

const DateRangePicker = ({ 
  onChange, 
  placeholder = "Selecciona fechas",
  excludedDates = [],
  startDate: externalStartDate,
  endDate: externalEndDate
}) => {
  // Agregar estilos globales al montar el componente
  useEffect(() => {
    addGlobalStyles();
  }, []);

  // Estados para manejar las fechas y la UI
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(externalStartDate);
  const [endDate, setEndDate] = useState(externalEndDate);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('firstMonth'); // 'firstMonth', 'secondMonth'
  const calendarRef = useRef(null);

  // Detectar si el dispositivo es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

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

  // Verificar si una fecha es la de inicio
  const isStartDate = (day, month, year) => {
    if (!startDate) return false;
    
    return (
      day === startDate.getDate() &&
      month === startDate.getMonth() &&
      year === startDate.getFullYear()
    );
  };

  // Verificar si una fecha es la de fin
  const isEndDate = (day, month, year) => {
    if (!endDate) return false;
    
    return (
      day === endDate.getDate() &&
      month === endDate.getMonth() &&
      year === endDate.getFullYear()
    );
  };

  // Verificar si una fecha está seleccionada como inicio o fin
  const isStartOrEndDate = (day, month, year) => {
    return isStartDate(day, month, year) || isEndDate(day, month, year);
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

  // Cambiar entre meses en móvil
  const toggleMonthView = () => {
    setViewMode(viewMode === 'firstMonth' ? 'secondMonth' : 'firstMonth');
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
    // Restaurar las fechas externas si se cancela
    setStartDate(externalStartDate);
    setEndDate(externalEndDate);
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
          className="w-8 h-8 md:w-8 md:h-8"
        ></div>
      );
    }
    
    const { day, month, year } = dayInfo;
    const isDisabled = isPastDate(day, month, year) || isExcludedDate(day, month, year);
    const isStart = isStartDate(day, month, year);
    const isEnd = isEndDate(day, month, year);
    const isRangeDay = isInRange(day, month, year);
    const isTodayDate = isToday(day, month, year);
    
    // Definir clases para estilos
    let dayClass = `${isMobile ? 'w-10 h-10' : 'w-8 h-8'} flex items-center justify-center text-xs transition-all duration-300 relative`;
    
    if (isDisabled) {
      dayClass += ' text-gray-300 cursor-not-allowed';
    } else if (isStart) {
      dayClass += ' bg-[#7a0715] text-white rounded-full cursor-pointer hover:bg-[#3b0012] shadow-sm z-10';
    } else if (isEnd) {
      dayClass += ' bg-[#7a0715] text-white rounded-full cursor-pointer hover:bg-[#3b0012] shadow-sm z-10';
    } else if (isRangeDay) {
      // Todas las fechas en el rango ahora tienen bordes completamente redondeados
      dayClass += ' bg-[#e6b465]/50 text-[#3d2130] cursor-pointer hover:bg-[#e6b465]/60 rounded-full';
    } else if (isTodayDate) {
      dayClass += ' border border-[#c78418] bg-[#F9F7F4] rounded-full cursor-pointer hover:bg-[#e6b465]/30';
    } else {
      dayClass += ' text-[#1e1e1e] cursor-pointer hover:bg-[#e6b465]/30 hover:rounded-full';
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
          {!isSecondMonth || (isMobile && viewMode === 'secondMonth') ? (
            <button 
              onClick={isMobile ? (isSecondMonth ? toggleMonthView : goToPreviousMonth) : goToPreviousMonth}
              className="p-1 text-[#7a0715] hover:bg-[#e6b465]/20 rounded-full transition-all duration-300 transform hover:scale-105"
              type="button"
              aria-label="Mes anterior"
            >
              <ChevronLeft size={isMobile ? 20 : 16} />
            </button>
          ) : (
            <div className="w-6">{/* Espacio para mantener alineación */}</div>
          )}
          
          <div className="text-center">
            <h3 className="text-[#1e1e1e] font-medium text-sm mb-0.5">{monthNames[month]}</h3>
            <p className="text-xs text-gray-500">{year}</p>
          </div>
          
          {isSecondMonth || (isMobile && viewMode === 'firstMonth') ? (
            <button 
              onClick={isMobile ? (isSecondMonth ? goToNextMonth : toggleMonthView) : goToNextMonth}
              className="p-1 text-[#7a0715] hover:bg-[#e6b465]/20 rounded-full transition-all duration-300 transform hover:scale-105"
              type="button"
              aria-label={isMobile && !isSecondMonth ? "Ver mes siguiente" : "Mes siguiente"}
            >
              <ChevronRight size={isMobile ? 20 : 16} />
            </button>
          ) : (
            <div className="w-6">{/* Espacio para mantener alineación */}</div>
          )}
        </div>
        
        {/* Días de la semana */}
        <div className="grid grid-cols-7 mb-1">
          {weekDays.map((day, i) => (
            <div key={day} className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} flex items-center justify-center text-xs text-[#757575]`}>
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
      </div>
    );
  };

  return (
    <div className="relative" ref={calendarRef}>
      {/* Input para mostrar las fechas seleccionadas */}
      <div 
        className="flex items-center relative cursor-pointer border border-gray-300 rounded-lg px-4 py-2 hover:border-[#c78418] transition-colors duration-300 focus-within:ring-2 focus-within:ring-[#7a0715]/30 focus-within:border-[#7a0715]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[#7a0715] mr-3">
          <Calendar size={20} />
        </span>
        <span className={startDate && endDate ? 'text-[#1e1e1e]' : 'text-gray-400'}>
          {displayText}
        </span>
      </div>
      
      {/* Panel del calendario - Versión móvil */}
      {isOpen && isMobile && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
            {/* Cabecera con título y botón de cerrar */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-[#3d2130]">Seleccionar fechas</h3>
              <button 
                onClick={handleCancel}
                className="text-gray-500 hover:text-[#7a0715] transition-colors duration-300 p-1 hover:bg-gray-100 rounded-full"
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Contenedor del calendario */}
            <div className="p-4 flex-1 overflow-auto">
              {/* Mostrar solo un mes a la vez en móvil */}
              {viewMode === 'firstMonth' ? (
                renderMonth(firstMonth.year, firstMonth.month, false)
              ) : (
                renderMonth(secondMonth.year, secondMonth.month, true)
              )}
              
              {/* Información de fechas seleccionadas */}
              <div className="mt-4 mb-2 flex justify-between">
                <div>
                  <div className="text-xs font-medium text-[#3d2130]">Fecha de inicio:</div>
                  <div className="text-[#7a0715] font-bold">
                    {startDate ? formatDateDisplay(startDate) : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-[#3d2130]">Fecha de fin:</div>
                  <div className="text-[#7a0715] font-bold">
                    {endDate ? formatDateDisplay(endDate) : '-'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex border-t border-gray-200 px-4 py-3 space-x-2">
              <button
                className="flex-1 px-4 py-2 text-center text-[#7a0715] border border-[#7a0715] rounded-full text-sm transition-all duration-300 hover:bg-[#F9F7F4] shadow-sm"
                onClick={handleCancel}
                type="button"
              >
                Cancelar
              </button>
              <button
                className={`flex-1 px-4 py-2 text-center text-sm font-medium rounded-full transition-all duration-300 shadow-sm ${
                  canApply 
                    ? 'bg-[#7a0715] hover:bg-[#3b0012] text-white transform hover:scale-[1.02]' 
                    : 'bg-[#e6b465] text-[#3d2130]'
                }`}
                onClick={canApply ? handleApply : undefined}
                disabled={!canApply}
                type="button"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Panel del calendario - Versión desktop */}
      {isOpen && !isMobile && (
        <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-[#e6b465] w-[580px] overflow-hidden animate-slideIn">
          {/* Cabecera con título y botón de cerrar */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#F9F7F4]/50">
            <h3 className="text-lg font-medium text-[#3d2130]">Seleccionar fechas</h3>
            <button 
              onClick={handleCancel}
              className="text-gray-500 hover:text-[#7a0715] transition-colors duration-300 p-1 hover:bg-white rounded-full"
              type="button"
            >
              <X size={20} />
            </button>
          </div>
          
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
          
          {/* Fechas seleccionadas - Ahora visible en desktop igual que en móvil */}
          <div className="px-5 pb-3 flex justify-between">
            <div>
              <div className="text-xs font-medium text-[#3d2130]">Fecha de inicio:</div>
              <div className="text-[#7a0715] font-bold">
                {startDate ? formatDateDisplay(startDate) : '-'}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-[#3d2130]">Fecha de fin:</div>
              <div className="text-[#7a0715] font-bold">
                {endDate ? formatDateDisplay(endDate) : '-'}
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex border-t border-gray-200 p-2 bg-[#F9F7F4]/50">
            <button
              className="flex-1 px-4 py-2 text-center text-[#7a0715] border border-[#7a0715] mx-2 rounded-full text-sm transition-all duration-300 hover:bg-white shadow-sm"
              onClick={handleCancel}
              type="button"
            >
              Cancelar
            </button>
            <button
              className={`flex-1 px-4 py-2 text-center text-sm font-medium mx-2 rounded-full transition-all duration-300 shadow-sm ${
                canApply 
                  ? 'bg-[#7a0715] hover:bg-[#3b0012] text-white transform hover:scale-[1.02]' 
                  : 'bg-[#e6b465] text-[#3d2130]'
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