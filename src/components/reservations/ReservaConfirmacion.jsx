import { CheckCircle, AlertTriangle, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
export default function ReservaConfirmacion() {
  const navigate = useNavigate();
  const location = useLocation(); // Accede a la ubicación actual
  const { status, reservaInfo } = location.state || {}; // Extrae los datos desde state
  const { user } = useAuth();
  console.log("data que resive ReservaConfirmacion", reservaInfo);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8e6e6] p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg text-center border-l-4 border-[#a52a2a]">
        {status === true ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h2 className="text-3xl font-semibold text-[#7a0715] mt-4">¡Reserva Exitosa!</h2>
            <p className="text-xl font-medium text-gray-700 mt-2">{`${user.firstName} ${user.lastName}`}</p>
            <p className="text-lg text-gray-700 mt-2">Tu reserva se ha realizado con éxito.</p>
            <p className="text-lg text-gray-700 mt-2">{`Hemos enviado un correo a ${user.email} con los detalles de la reserva.`}</p>

            {/* Foto del producto y nombre */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <img
                src={reservaInfo.response.productImageUrl}
                alt="Producto"
                className="w-20 h-20 object-cover rounded-md border-2 border-[#a52a2a]"
              />
              <p className="text-xl font-semibold text-gray-700">{reservaInfo.response.productName}</p>
            </div>

            {/* Detalles de la reserva */}
            <div className="mt-6 text-left text-gray-700">
              <p><strong>Fecha de inicio: </strong>{reservaInfo.response.startDate}</p>
              <p><strong>Fecha de finalización: </strong>{reservaInfo.response.endDate}</p>
              <p><strong>Cantidad: </strong>{reservaInfo.response.quantity} unidad(es)</p>
              <p><strong>Subtotal: </strong>{formatPrice(reservaInfo.response.totalPrice)}</p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="mt-6 px-8 py-3 bg-[#7a0715] text-white rounded-xl hover:bg-[#5b0512] transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Home className="w-5 h-5" /> Volver a inicio
            </button>
          </>
        ) : (
          <>
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto" />
            <h2 className="text-3xl font-semibold text-red-600 mt-4">¡Error en la Reserva!</h2>
            <p className="text-lg text-gray-700 mt-2">Hubo un problema al procesar tu reserva.</p>
            <p className="text-lg text-gray-700 mt-2">Razón: {reservaInfo.message}</p>

            <button
              onClick={() => navigate(`/product/${reservaInfo.idProduct}`)}
              className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 mx-auto"
            >
              Intentar de nuevo
            </button>
          </>
        )}
      </div>
    </div>

  );
}
