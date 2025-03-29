// components/reservations/ReservationListItem.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const ReservationListItem = ({ reservation }) => {
    const { id, productName, productImage, startDate, endDate, status } = reservation;

    // Formatear fechas para mostrar en formato más amigable
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Formato corto para móviles
    const formatShortDate = (dateString) => {
        const options = { day: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Determinar color de estado
    const getStatusStyle = () => {
        switch (status.toLowerCase()) {
            case 'completada':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'pendiente':
                return 'bg-amber-100 text-amber-800 border border-amber-200';
            case 'cancelada':
                return 'bg-red-100 text-red-800 border border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    return (
        <div className="bg-white border border-gray-200 hover:border-[#e6b465] rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            <Link to={`/product/${id}`} className="block">
                <div className="flex items-center p-3">
                    {/* Imagen en miniatura */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-[#F9F7F4] rounded-md overflow-hidden mr-3 sm:mr-4">
                        <img
                            src={productImage}
                            alt={productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/img/placeholder.jpg";
                            }}
                        />
                    </div>

                    {/* Información principal - Adaptada para responsive */}
                    <div className="flex-grow min-w-0 mr-2">
                        <h3 className="text-sm sm:text-base font-semibold text-[#3b0012] truncate">{productName}</h3>

                        {/* Fechas para pantallas móviles (visible solo en móvil) */}
                        <div className="flex items-center text-xs text-[#3d2130] mt-1 sm:hidden">
                            <Calendar className="w-3 h-3 text-[#c78418] mr-1" />
                            <span>{formatShortDate(startDate)} - {formatShortDate(endDate)}</span>
                        </div>

                        {/* Fechas para pantallas más grandes (oculto en móvil) */}
                        <div className="hidden sm:flex items-center text-sm text-[#3d2130] mt-1">
                            <Calendar className="w-3.5 h-3.5 text-[#c78418] mr-1.5" />
                            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
                        </div>
                    </div>

                    {/* Estado y acción - Adaptados para responsive */}
                    <div className="flex-shrink-0 flex flex-col items-end">
                        <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium mb-1.5 sm:mb-2 ${getStatusStyle()}`}>
                            {status}
                        </span>
                        <span className="text-xs sm:text-sm text-[#7a0715] font-medium hover:underline">
                            Ver detalles
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

ReservationListItem.propTypes = {
    reservation: PropTypes.shape({
        id: PropTypes.number.isRequired,
        productName: PropTypes.string.isRequired,
        productImage: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
    }).isRequired,
};

export default ReservationListItem;