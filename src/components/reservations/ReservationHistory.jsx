// components/reservations/ReservationHistory.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Filter } from 'lucide-react';

// Componentes
import ReservationList from './ReservationList';
import EmptyState from '../common/EmptyState';

// Importar el servicio de reservas
import reservationService from '../../services/reservations/reservationsService';

// Hook personalizado para obtener reservas
const useReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            toast.error('Debes iniciar sesión para ver tu historial');
            return;
        }

        const fetchReservations = async () => {
            try {
                setLoading(true);
                setError(null);

                // Llamada al servicio real para obtener las reservas
                const response = await reservationService.getUserReservations();
                
                if (response && response.statusCode === 200 && response.response) {
                    // Transformar datos para que coincidan con la estructura esperada
                    const mappedReservations = response.response.map(res => ({
                        id: res.idReservation,
                        productName: res.productName || 'Instrumento sin nombre',
                        productImage: res.productImageUrl || '/img/placeholder.jpg',
                        productImageURL: res.productImageUrl || '/img/placeholder.jpg', // Para compatibilidad con ReservationListItem
                        startDate: res.startDate,
                        endDate: res.endDate,
                        quantity: res.quantity || 1,
                        status: translateStatus(res.status)
                    }));

                    // Ordenar por fecha de inicio (la más reciente primero)
                    const sortedReservations = [...mappedReservations].sort((a, b) => {
                        // Convertir strings de fecha a objetos Date para comparación
                        const dateA = new Date(a.startDate);
                        const dateB = new Date(b.startDate);
                        // Orden descendente (más reciente primero)
                        return dateB - dateA;
                    });

                    setReservations(sortedReservations);
                } else {
                    throw new Error('Formato de respuesta inesperado');
                }
            } catch (error) {
                console.error('Error al cargar el historial:', error);
                setError('No se pudo cargar el historial de reservas');
                toast.error('No se pudo cargar el historial de reservas');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [navigate]);

    // Función para traducir los estados del inglés al español
    const translateStatus = (apiStatus) => {
        if (!apiStatus) return 'Pendiente';
        
        switch(apiStatus.toUpperCase()) {
            case 'PENDING':
                return 'Pendiente';
            case 'COMPLETED':
                return 'Completada';
            case 'CANCELLED':
                return 'Cancelada';
            case 'ACTIVE':
                return 'Activa';
            default:
                return apiStatus; // Mantener el original si no hay coincidencia
        }
    };

    return { reservations, loading, error };
};

// Componente principal que orquesta la visualización
export const ReservationHistory = () => {
    const { reservations, loading, error } = useReservations();
    const navigate = useNavigate();

    // Estado para filtros (se podría expandir)
    const [filterStatus, setFilterStatus] = useState('todos');

    // Filtrar reservas según el estado seleccionado
    const filteredReservations = filterStatus === 'todos'
        ? reservations
        : reservations.filter(res => res.status.toLowerCase() === filterStatus.toLowerCase());

    // Renderizado condicional basado en el estado
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 border-[#7a0715]"></div>
                </div>
            );
        }

        if (error) {
            return (
                <EmptyState
                    icon="alert"
                    title="Error al cargar"
                    description={error}
                    actionText="Intentar nuevamente"
                    actionLink="/reservations"
                />
            );
        }

        if (reservations.length === 0) {
            return (
                <EmptyState
                    icon="search"
                    title="Sin reservas anteriores"
                    description="No tienes reservas de instrumentos en tu historial. ¡Comienza a explorar nuestra colección!"
                    actionText="Explorar instrumentos"
                    actionLink="/products"
                />
            );
        }

        if (filteredReservations.length === 0) {
            return (
                <div className="text-center py-6 text-[#3d2130]">
                    <p>No hay reservas que coincidan con el filtro seleccionado.</p>
                </div>
            );
        }

        return <ReservationList reservations={filteredReservations} />;
    };

    return (
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto">
                <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-1 h-6 sm:h-8 bg-[#c78418] mr-3 sm:mr-4"></div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#3b0012] font-alata">Mi historial de reservas</h1>
                </div>

                {!loading && reservations.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 mb-3 sm:mb-4">
                        {/* Filtrado para móviles (ajustado para prevenir cortes) */}
                        <div className="sm:hidden">
                            <div className="flex items-center mb-1.5">
                                <Filter className="text-[#3d2130] mr-1.5" size={14} />
                                <span className="text-[#3d2130] text-xs font-medium">Filtrar:</span>
                            </div>
                            <div className="flex space-x-1.5 overflow-x-auto pb-1 px-0.5 w-full scrollbar-hide">
                                <button
                                    onClick={() => setFilterStatus('todos')}
                                    className={`px-2.5 py-0.5 rounded-full text-xs whitespace-nowrap flex-shrink-0 ${filterStatus === 'todos'
                                        ? 'bg-[#7a0715] text-white'
                                        : 'bg-gray-100 text-[#3d2130] hover:bg-gray-200'
                                        }`}
                                >
                                    Todos
                                </button>
                                <button
                                    onClick={() => setFilterStatus('completada')}
                                    className={`px-2.5 py-0.5 rounded-full text-xs whitespace-nowrap flex-shrink-0 ${filterStatus === 'completada'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                        }`}
                                >
                                    Completadas
                                </button>
                                <button
                                    onClick={() => setFilterStatus('pendiente')}
                                    className={`px-2.5 py-0.5 rounded-full text-xs whitespace-nowrap flex-shrink-0 ${filterStatus === 'pendiente'
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                        }`}
                                >
                                    Pendientes
                                </button>
                                <button
                                    onClick={() => setFilterStatus('cancelada')}
                                    className={`px-2.5 py-0.5 rounded-full text-xs whitespace-nowrap flex-shrink-0 ${filterStatus === 'cancelada'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                        }`}
                                >
                                    Canceladas
                                </button>
                            </div>
                        </div>

                        {/* Filtrado para desktop */}
                        <div className="hidden sm:flex items-center justify-between">
                            <div className="flex items-center">
                                <Filter className="text-[#3d2130] mr-2" size={18} />
                                <span className="text-[#3d2130] text-sm font-medium">Filtrar por estado:</span>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setFilterStatus('todos')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${filterStatus === 'todos'
                                        ? 'bg-[#7a0715] text-white'
                                        : 'bg-gray-100 text-[#3d2130] hover:bg-gray-200'
                                        }`}
                                >
                                    Todos
                                </button>
                                <button
                                    onClick={() => setFilterStatus('completada')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${filterStatus === 'completada'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                        }`}
                                >
                                    Completadas
                                </button>
                                <button
                                    onClick={() => setFilterStatus('pendiente')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${filterStatus === 'pendiente'
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                        }`}
                                >
                                    Pendientes
                                </button>
                                <button
                                    onClick={() => setFilterStatus('cancelada')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${filterStatus === 'cancelada'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                        }`}
                                >
                                    Canceladas
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {renderContent()}

                {!loading && reservations.length > 0 && (
                    <div className="mt-4 sm:mt-6 text-center">
                        <button
                            onClick={() => navigate('/products')}
                            className="text-[#7a0715] hover:text-[#3b0012] font-medium text-xs sm:text-sm"
                        >
                            Explorar más instrumentos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReservationHistory;