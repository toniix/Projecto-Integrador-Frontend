import  { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./AvailabilityCalendar.css";
import axios from 'axios';
import { errorToast } from '../../utils/toastNotifications';

// Configurar localización en español
moment.locale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
});

const API_URL = import.meta.env.VITE_API_URL;

const localizer = momentLocalizer(moment);

// Mensajes personalizados para los botones y etiquetas del calendario
const messages = {
  today: 'Hoy',
  previous: 'Anterior',
  next: 'Siguiente',
  month: 'Mes',
  day: 'Día',
  week: 'Semana',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este rango',
};

// Componente personalizado para la barra de herramientas
const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span className="text-lg md:text-xl lg:text-2xl font-regular">
        {date.format('MMMM YYYY')} 
      </span>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
      <div className="text-center sm:text-left">
        {label()}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={goToBack} className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 text-sm sm:text-base">Anterior</button>
        <button type="button" onClick={goToCurrent} className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 text-sm sm:text-base">Actual</button>
        <button type="button" onClick={goToNext} className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 text-sm sm:text-base">Siguiente</button>
      </div>
    </div>
  );
};

function AvailabilityCalendar({ productId, productStock }) {
  const [reservations, setReservations] = useState([]);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/reservations/product/${productId}`);
        
        const events = response.data.response.map(reservation => ({
          title: `Disponible: ${productStock - reservation.quantity} unidad(es)`,
          start: moment(reservation.startDate).startOf('day').toDate(),
          end: moment(reservation.endDate).endOf('day').toDate(),
          allDay: true,
          resource: reservation
        }));
        
        setReservations(events);
        
        // Mapa de disponibilidad por día
        const availMap = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6); // Mostrar disponibilidad para 6 meses (se puede ajustar si queremos más o menos)
        
        // Inicializar todos los días con disponibilidad completa
        for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          availMap[dateStr] = productStock;
        }
        
        // Restar las reservas existentes
        response.data.response.forEach(reservation => {
          const start = moment(reservation.startDate).startOf('day').toDate();
          const end = moment(reservation.endDate).endOf('day').toDate();
          
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            if (availMap[dateStr] !== undefined) {
              availMap[dateStr] -= reservation.quantity;
            }
          }
        });
        
        setAvailabilityMap(availMap);
        setLoading(false);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        errorToast(`Error al cargar las reservas: ${errorMessage}`);
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (productId && productStock) {
      fetchReservations();
    }
  }, [productId, productStock]);

  // Función para personalizar el estilo de las celdas del día según disponibilidad
  const dayPropGetter = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return {
        style: {
          backgroundColor: '#e0e0e0', // Gris para fechas pasadas
          color: '#888888'
        }
      };
    }
    
    const dateStr = date.toISOString().split('T')[0];
    const availability = availabilityMap[dateStr];
    
    if (availability === undefined) return {};
    
    if (availability <= 0) {
      return {
        style: {
          backgroundColor: 'rgba(220, 53, 69, 0.5)', // Rojo para sin disponibilidad
        }
      };
    } else if (availability < productStock * 0.3) {
      return {
        style: {
          backgroundColor: 'rgba(255, 193, 7, 0.5)', // Amarillo para poca disponibilidad
        }
      };
    } else if (availability < productStock) {
      return {
        style: {
          backgroundColor: 'rgba(40, 167, 69, 0.5)', // Verde claro para buena disponibilidad
        }
      };
    } else {
      return {
        style: {
          backgroundColor: 'rgba(25, 135, 84, 0.5)', // Verde oscuro para disponibilidad completa
        }
      };
    }  };

  // Barra que muestra la disponibilidad del producto descontando las reservas
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: '#555555', // Gris oscuro para las barras de reservas
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        display: 'block',
        opacity: 0.8
      }
    };
  };

  // Manejadores para la navegación del calendario
  const onNavigate = (newDate) => {
    setDate(newDate);
  };

  if (loading) return <div>Cargando calendario de disponibilidad...</div>;
  if (error) return <div>Error al cargar las reservas: {error}</div>;

  return (
    <div className="min-h-[300px] h-[50vh] md:h-[60vh] lg:h-[600px] my-3 md:my-5">
      <p className="text-xl md:text-2xl mb-2 md:mb-3">Disponibilidad del Producto</p>
      <div className="flex justify-center flex-wrap gap-2 md:gap-4 my-2 md:my-4 text-sm md:text-base">
        <div className="flex items-center">
          <span className="w-4 h-4 md:w-5 md:h-5 inline-block mr-1 md:mr-1.5" style={{ backgroundColor: 'rgba(220, 53, 69, 0.5)' }}></span>
          <span>No disponible</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 md:w-5 md:h-5 inline-block mr-1 md:mr-1.5" style={{ backgroundColor: 'rgba(255, 193, 7, 0.5)' }}></span>
          <span>Poca disponibilidad</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 md:w-5 md:h-5 inline-block mr-1 md:mr-1.5" style={{ backgroundColor: 'rgba(40, 167, 69, 0.5)' }}></span>
          <span>Buena disponibilidad</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 md:w-5 md:h-5 inline-block mr-1 md:mr-1.5" style={{ backgroundColor: 'rgba(25, 135, 84, 0.5)' }}></span>
          <span>Disponibilidad completa</span>
        </div>
      </div>
      <Calendar
        localizer={localizer}
        events={reservations}
        startAccessor="start"
        endAccessor="end"
        className="h-[calc(100%-80px)] text-xs sm:text-sm md:text-base"
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventStyleGetter}
        views={['month']}
        defaultView="month"
        tooltipAccessor={(event) => event.title}
        messages={messages}
        date={date}
        onNavigate={onNavigate}
        components={{
          toolbar: CustomToolbar
        }}
      />
    </div>
  );
}
export default AvailabilityCalendar;

