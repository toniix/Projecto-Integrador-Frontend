import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export const ReservationCard = ({ reservation }) => {
    const { id, productName, productImage, startDate, endDate, status } = reservation;

    // Formatear fechas para mostrar en formato más amigable
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Determinar color de estado
    const getStatusColor = () => {
        switch (status.toLowerCase()) {
            case 'completada':
                return 'bg-green-100 text-green-800';
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelada':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
            <div className="h-48 flex items-center justify-center bg-white">
                <img
                    src={productImage}
                    alt={productName}
                    className="max-h-full max-w-full object-contain p-2"
                />
            </div>

            <div className="p-5">
                <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">{productName}</h3>

                <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[#757575] text-sm">Desde:</span>
                        <span className="font-medium">{formatDate(startDate)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-[#757575] text-sm">Hasta:</span>
                        <span className="font-medium">{formatDate(endDate)}</span>
                    </div>

                    <div className="pt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                            {status}
                        </span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                    <Link
                        to={`/product/${id}`}
                        className="text-[#730f06] hover:text-[#3e0b05] font-medium transition-colors duration-300"
                    >
                        Ver detalles del producto
                    </Link>
                </div>
            </div>
        </div>
    );
};

ReservationCard.propTypes = {
    reservation: PropTypes.shape({
        id: PropTypes.number.isRequired,
        productName: PropTypes.string.isRequired,
        productImage: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
    }).isRequired,
};