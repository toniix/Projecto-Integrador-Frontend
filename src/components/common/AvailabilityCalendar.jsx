import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./AvailabilityCalendar.css";
import axios from 'axios';
import { errorToast, successToast } from '../../utils/toastNotifications';
import LoginModal from '../user/login/LoginModal';
import { useAuth, isTokenValid, getToken } from '../../context/auth/AuthContext';
import { id } from 'date-fns/locale';

// Configurar localización en español
moment.locale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
});

const API_URL = import.meta.env.VITE_API_URL;
const RESERVATION_URL = API_URL + "/reservations";

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

// Barra de herramientas
const CustomToolbar = (toolbar) => {
  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span className="text-lg md:text-xl lg:text-2xl font-regular">
        {date.format('MMMM YYYY')} 
      </span>
    );
  };

  return (
    <div className="flex justify-center items-center mb-4">
      <div className="text-center">
        {label()}
      </div>
    </div>
  );
};

function AvailabilityCalendar({ productId, productStock, productPrice, onDateRangeSelect }) {
  const [reservations, setReservations] = useState([]);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReserving, setIsReserving] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // Verificar si el usuario está autenticado
  const { getUserId } = useAuth();
  const isUserAuthenticated = isTokenValid();
  const userId = getUserId();
  
  // Estados para las fechas de los calendarios
  const [currentDate, setCurrentDate] = useState(() => {
    // Asegurarse de que comience en el mes actual
    const today = new Date();
    today.setDate(1); // Primer día del mes
    return today;
  });
  
  const [nextMonthDate, setNextMonthDate] = useState(() => {
    // Mes siguiente al actual
    const nextMonth = new Date();
    nextMonth.setDate(1); // Primer día del mes
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  });
  
  // Estados para la selección de fechas
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [quantityToReserve, setQuantityToReserve] = useState(1);
  const [selectionMode, setSelectionMode] = useState('start'); // 'start' o 'end'

  // Verificar si estamos en el mes actual (para deshabilitar el botón "Anterior")
  const isCurrentMonthTheSystemCurrentMonth = () => {
    const today = new Date();
    return currentDate.getFullYear() === today.getFullYear() && 
           currentDate.getMonth() === today.getMonth();
  };

  // Función para navegar ambos calendarios a la vez
  const navigateCalendars = (direction) => {
    const newCurrentDate = new Date(currentDate);
    const newNextMonthDate = new Date(nextMonthDate);
    const today = new Date();
    
    if (direction === 'PREV') {
      // Verificar si retroceder nos llevaría a un mes anterior al actual
      newCurrentDate.setMonth(newCurrentDate.getMonth() - 1);
      newNextMonthDate.setMonth(newNextMonthDate.getMonth() - 1);
      
      // Comprobar si el nuevo mes actual es anterior al mes actual del sistema
      if (newCurrentDate.getFullYear() < today.getFullYear() || 
          (newCurrentDate.getFullYear() === today.getFullYear() && 
           newCurrentDate.getMonth() < today.getMonth())) {
        // No permitir retroceder más allá del mes actual
        errorToast('No se pueden visualizar meses anteriores al actual');
        return;
      }
    } else if (direction === 'NEXT') {
      newCurrentDate.setMonth(newCurrentDate.getMonth() + 1);
      newNextMonthDate.setMonth(newNextMonthDate.getMonth() + 1);
    }
    
    setCurrentDate(newCurrentDate);
    setNextMonthDate(newNextMonthDate);
  };

// Función para crear una reserva
const createReservation = async () => {
  if (!startDate || !endDate || !productId) {
    errorToast('Faltan datos necesarios para realizar la reserva');
    return;
  }

  if (!isUserAuthenticated) {
    openLoginModal();
    return;
  }

  try {
    setIsReserving(true);
    
    // Formatear las fechas como YYYY-MM-DD
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    // Obtener el token de autenticación
    const token = getToken();
    console.log('Token:', token);
    
    // Realizar la petición POST al backend con el formato requerido
    const response = await axios.post(`${RESERVATION_URL}`, {
      idProduct: parseInt(productId),
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      quantity: parseInt(quantityToReserve),
      status: 'PENDING',
      idUser: userId,
      productId: parseInt(productId),
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    // Verificar la respuesta
    if (response.data && response.status === 200) {
      successToast('¡Reserva realizada con éxito!');
      
      // Notificar al componente padre
      if (onDateRangeSelect) {
        onDateRangeSelect({
          startDate: startDate,
          endDate: endDate,
          quantity: quantityToReserve,
          subtotal: calculateSubtotal(),
          reservationId: response.data.id || null
        });
      }
      
      // Actualizar el calendario y reiniciar la selección
      fetchReservations();
      resetSelection();
    } else {
      throw new Error('La respuesta del servidor no tiene el formato esperado');
    }
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
    errorToast(`Error al crear la reserva: ${errorMessage}`);
  } finally {
    setIsReserving(false);
  }
};

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${RESERVATION_URL}/product/${productId}`);
      
      // Verificar la estructura de la respuesta y proporcionar valores por defecto
      const responseData = response.data || {};
      const reservationsData = responseData.response || [];
      
      // Asegurarse de que reservationsData sea un array
      const reservationsArray = Array.isArray(reservationsData) ? reservationsData : [];
      
      const events = reservationsArray.map(reservation => ({
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
      endDate.setMonth(endDate.getMonth() + 6); // Mostrar disponibilidad para 6 meses
      
      // Inicializar todos los días con disponibilidad completa
      for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        availMap[dateStr] = productStock;
      }
      
      // Restar las reservas existentes
      reservationsArray.forEach(reservation => {
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
      console.error("Error completo:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
      errorToast(`Error al cargar las reservas: ${errorMessage}`);
      setError(errorMessage);
      setLoading(false);
      
      // Inicializar con valores por defecto en caso de error
      setReservations([]);
      
      // Crear un mapa de disponibilidad por defecto
      const availMap = {};
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 6);
      
      for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        availMap[dateStr] = productStock;
      }
      
      setAvailabilityMap(availMap);
    }
  };

  useEffect(() => {
    if (productId && productStock) {
      fetchReservations();
    } else {
      // Si no hay productId o productStock, inicializar con valores por defecto
      setLoading(false);
      setReservations([]);
      
      const availMap = {};
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 6);
      
      for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        availMap[dateStr] = productStock || 0;
      }
      
      setAvailabilityMap(availMap);
    }
  }, [productId, productStock]);

  // Función para verificar si una fecha es seleccionable basada en la disponibilidad
  const isDateSelectable = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const availability = availabilityMap[dateStr];
    
    // No seleccionable si es fecha pasada
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;
    
    // No seleccionable si no hay suficiente disponibilidad
    return availability >= quantityToReserve;
  };

  // Función para manejar la selección de fechas
  const handleDateSelect = (date) => {
    // Convertir a fecha de inicio de día para evitar problemas con horas
    const selectedDate = moment(date).startOf('day').toDate();
    
    if (!isDateSelectable(selectedDate)) {
      errorToast('Esta fecha no está disponible para la cantidad seleccionada');
      return;
    }
    
    if (selectionMode === 'start') {
      setStartDate(selectedDate);
      setEndDate(null);
      setSelectionMode('end');
      successToast('Fecha de inicio seleccionada. Ahora seleccione la fecha de finalización.');
    } else {
      // Verificar que la fecha de fin sea posterior a la de inicio
      if (selectedDate < startDate) {
        errorToast('La fecha de finalización debe ser posterior a la fecha de inicio');
        return;
      }
      
      // Verificar que todas las fechas en el rango tengan disponibilidad suficiente
      let hasAvailability = true;
      for (let d = new Date(startDate); d <= selectedDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if (availabilityMap[dateStr] < quantityToReserve) {
          hasAvailability = false;
          break;
        }
      }
      
      if (!hasAvailability) {
        errorToast('No hay disponibilidad suficiente para todas las fechas en el rango seleccionado');
        return;
      }
      
      setEndDate(selectedDate);
      setSelectionMode('start');
      
      successToast('Rango de fechas seleccionado correctamente');
    }
  };

  // Función para reiniciar la selección
  const resetSelection = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectionMode('start');
  };

  // Función para personalizar el estilo de las celdas del día según disponibilidad y selección
  const dayPropGetter = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];
    const availability = availabilityMap[dateStr];
    
    // Estilo base
    let style = {};
    
    // Fechas pasadas
    if (date < today) {
      style = {
        backgroundColor: '#e0e0e0', // Gris para fechas pasadas
        color: '#888888',
        cursor: 'not-allowed'
      };
    }
    // Fechas seleccionadas
    else if (startDate && endDate && date >= startDate && date <= endDate) {
      style = {
        backgroundColor: '#4a90e2', // Azul para fechas seleccionadas
        color: 'white',
        fontWeight: 'bold'
      };
    }
    // Fecha de inicio
    else if (startDate && moment(date).isSame(startDate, 'day')) {
      style = {
        backgroundColor: '#3273dc', // Azul más oscuro para fecha de inicio
        color: 'white',
        fontWeight: 'bold'
      };
    }
    // Disponibilidad
    else if (availability !== undefined) {
      if (availability < quantityToReserve) {
        style = {
          backgroundColor: 'rgba(220, 53, 69, 0.5)', // Rojo para sin disponibilidad suficiente
          cursor: 'not-allowed'
        };
      } else if (availability < productStock * 0.3) {
        style = {
          backgroundColor: 'rgba(255, 193, 7, 0.5)', // Amarillo para poca disponibilidad
        };
      } else if (availability < productStock) {
        style = {
          backgroundColor: 'rgba(40, 167, 69, 0.5)', // Verde claro para buena disponibilidad
        };
      } else {
        style = {
          backgroundColor: 'rgba(25, 135, 84, 0.5)', // Verde oscuro para disponibilidad completa
        };
      }
    }
    
    return { style };
  };

  // Estilo para eventos (reservas existentes)
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

  // Manejador para cambiar la cantidad a reservar
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0 && newQuantity <= productStock) {
      setQuantityToReserve(newQuantity);
      // Reiniciar selección cuando cambia la cantidad
      resetSelection();
    } else {
      errorToast(`La cantidad debe estar entre 1 y ${productStock}`);
    }
  };

  // Calcular el subtotal basado en el precio, cantidad y duración
  const calculateSubtotal = () => {
    if (!startDate || !endDate || !productPrice) return 0;
    
    // Calcular la duración en días (incluyendo el día de inicio y fin)
    const durationInDays = moment(endDate).diff(moment(startDate), 'days') + 1;
    
    // Calcular el subtotal
    return productPrice * quantityToReserve * durationInDays;
  };

  // Formatear el precio para mostrar
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (loading) return <div>Cargando calendario de disponibilidad...</div>;
  if (error) return <div>Error al cargar las reservas: {error}</div>;

  // Verificar si hay alguna selección activa
  const hasSelection = startDate !== null;

  // Añadir un log para depuración
  console.log("Estado de autenticación:", { isUserAuthenticated, userId });

  return (
    <div className="my-3 md:my-5">
      <p className="text-xl md:text-2xl mb-2 md:mb-3">Disponibilidad del Producto</p>
      
      {/* Leyenda del calendario */}
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
        <div className="flex items-center">
          <span className="w-4 h-4 md:w-5 md:h-5 inline-block mr-1 md:mr-1.5" style={{ backgroundColor: '#3273dc' }}></span>
          <span>Seleccionado</span>
        </div>
      </div>
      
      {/* Botones de navegación para ambos calendarios */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => navigateCalendars('PREV')}
          disabled={isCurrentMonthTheSystemCurrentMonth()}
          className={`px-4 py-2 rounded-md ${
            isCurrentMonthTheSystemCurrentMonth() 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          &lt; Anterior
        </button>
        <button 
          onClick={() => navigateCalendars('NEXT')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
        >
          Siguiente &gt;
        </button>
      </div>
      
      {/* Contenedor de los dos calendarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calendario izquierdo */}
        <div className="min-h-[300px] h-[50vh] md:h-[60vh] lg:h-[500px]">
          <Calendar
            localizer={localizer}
            events={reservations}
            startAccessor="start"
            endAccessor="end"
            className="h-[calc(100%-40px)] text-xs sm:text-sm md:text-base"
            dayPropGetter={dayPropGetter}
            eventPropGetter={eventStyleGetter}
            views={['month']}
            defaultView="month"
            tooltipAccessor={(event) => event.title}
            messages={messages}
            date={currentDate}
            onNavigate={(date) => {
              setCurrentDate(date);
            }}
            components={{
              toolbar: CustomToolbar
            }}
            selectable
            onSelectSlot={(slotInfo) => handleDateSelect(slotInfo.start)}
          />
        </div>
        
        {/* Calendario derecho */}
        <div className="min-h-[300px] h-[50vh] md:h-[60vh] lg:h-[500px]">
          <Calendar
            localizer={localizer}
            events={reservations}
            startAccessor="start"
            endAccessor="end"
            className="h-[calc(100%-40px)] text-xs sm:text-sm md:text-base"
            dayPropGetter={dayPropGetter}
            eventPropGetter={eventStyleGetter}
            views={['month']}
            defaultView="month"
            tooltipAccessor={(event) => event.title}
            messages={messages}
            date={nextMonthDate}
            onNavigate={(date) => {
              setNextMonthDate(date);
            }}
            components={{
              toolbar: CustomToolbar
            }}
            selectable
            onSelectSlot={(slotInfo) => handleDateSelect(slotInfo.start)}
          />
        </div>
      </div>
      
      {/* Controles del calendario */}
      <div className="flex justify-between items-center mt-4">
        {/* Selector de cantidad a reservar */}
        <div className="flex items-center">
          <label htmlFor="quantityToReserve" className="text-sm font-medium text-gray-700 mr-2">
            Cantidad a reservar:
          </label>
          <input
            type="number"
            id="quantityToReserve"
            min="1"
            max={productStock}
            value={quantityToReserve}
            onChange={handleQuantityChange}
            className="w-16 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-500">
            (Máx: {productStock})
          </span>
        </div>
        
        {/* Botón de reinicio de la selección */}
        <button 
          onClick={resetSelection}
          disabled={!hasSelection}
          className={`px-4 py-2 rounded-md ${
            hasSelection 

              ? 'bg-[#3D2130] text-[#ffffff] hover:bg-[#604152]' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Reiniciar selección

        </button>      </div>
      
      {/* Resumen de la selección */}
      {startDate && endDate && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-medium mb-2">Resumen de su reserva</h3>
          <p><strong>Fecha de inicio:</strong> {moment(startDate).format('DD/MM/YYYY')}</p>
          <p><strong>Fecha de finalización:</strong> {moment(endDate).format('DD/MM/YYYY')}</p>
          <p><strong>Duración:</strong> {moment(endDate).diff(moment(startDate), 'days') + 1} días</p>
          <p><strong>Cantidad:</strong> {quantityToReserve} unidad(es)</p>
          <p><strong>Subtotal:</strong> {formatPrice(calculateSubtotal())}</p>
          
          {/* Botón de Reservar */}
          <div className="mt-4 flex justify-end">
            {!isUserAuthenticated ? (
              <div className="text-center w-full">
                <p className="text-amber-700 mb-2">Debe iniciar sesión para realizar una reserva</p>
                <button 
                  onClick={openLoginModal}
                  className="px-6 py-2 bg-[#7a0715]/90 text-[#ffffff] rounded-xl hover:bg-[#604152] shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  Iniciar Sesión
                </button>
              </div>
            ) : (
              <button 
                onClick={createReservation}
                disabled={isReserving}
                className={`px-6 py-2 ${
                  isReserving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#7a0715]/90 hover:bg-[#604152]'
                } text-[#ffffff] rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 flex items-center`}
              >
                {isReserving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  'Reservar'
                )}
              </button>            )}
          </div>
        </div>
      )}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}

export default AvailabilityCalendar;