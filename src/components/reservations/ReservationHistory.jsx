import { useEffect, useState } from 'react';
import { ReservationCard } from '../../components/reservations/Reservation Card';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ReservationHistory = () => {

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
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
                // Aquí iría la llamada a la API real cuando esté implementada
                // Por ahora, usamos datos de ejemplo
                const mockReservations = [
                    {
                        id: 1,
                        productName: 'Guitarra Acústica Yamaha',
                        productImage: '/img/guitarra-clasica2.jpg',
                        startDate: '2025-02-15',
                        endDate: '2025-02-20',
                        status: 'Completada'
                    },
                    {
                        id: 2,
                        productName: 'Piano Digital Casio',
                        productImage: '/img/piano-digital-casio.jpg',
                        startDate: '2025-01-10',
                        endDate: '2025-01-17',
                        status: 'Completada'
                    },
                    {
                        id: 3,
                        productName: 'Batería Electrónica Roland',
                        productImage: '/img/bateria-electronica.png',
                        startDate: '2025-03-05',
                        endDate: '2025-03-12',
                        status: 'Pendiente'
                    }
                ];

                // Simular llamada a API
                setTimeout(() => {
                    setReservations(mockReservations);
                    setLoading(false);
                }, 800);

                // Cuando la API esté lista:
                // const response = await axios.get('URL_DE_API/reservations/history', {
                //   headers: { Authorization: `Bearer ${token}` }
                // });
                // setReservations(response.data);
            } catch (error) {
                console.error('Error al cargar el historial:', error);
                toast.error('No se pudo cargar el historial de reservas');
                setLoading(false);
            }
        };

        fetchReservations();
    }, [navigate]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#3e0b05] mb-6 font-alata">Mi historial de reservas</h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#730f06]"></div>
                </div>
            ) : reservations.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-md">
                    <p className="text-[#757575] text-lg">No tienes reservas anteriores.</p>
                    <a
                        href="/products"
                        className="inline-block mt-4 bg-[#730f06] text-white px-6 py-2 rounded-lg hover:bg-[#3e0b05] transition-colors duration-300"
                    >
                        Explorar instrumentos
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reservations.map(reservation => (
                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
