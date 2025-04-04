import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useAuth } from "../../context";
import { getIconForFeature } from "../ProductFeatures/featureIcons";

const ReservationDetails = ({ isOpen, onClose, instrument }) => {
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 3)),
  });
  const [showMoreUserInfo, setShowMoreUserInfo] = useState(false);
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);

  // Manejador para la cantidad
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= instrument.stock) {
      setQuantity(value);
    }
  };

  // Calculate total days and price
  const calculateDays = () => {
    if (!date.from || !date.to) return 0;
    const diffTime = Math.abs(date.to.getTime() - date.from.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDays = calculateDays();
  const totalPrice = totalDays * instrument.price;

  // Check if date range is valid
  const isDateRangeValid = () => {
    if (!date.from || !date.to) return false;
    return date.from <= date.to;
  };

  // Simple date formatter
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString();
  };

  // Custom date picker handler
  const handleDateChange = (e, type) => {
    const newDate = new Date(e.target.value);
    if (type === "from") {
      setDate((prev) => ({ ...prev, from: newDate }));
    } else {
      setDate((prev) => ({ ...prev, to: newDate }));
    }
  };

  // Format date for input value
  const formatDateForInput = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  const handleReservationSubmit = () => {
    // Handle reservation submission logic here
    console.log("Reservation submitted:", {
      instrumentId: instrument.id,
      userId: user.id,
      dateFrom: date.from,
      dateTo: date.to,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#3d2130] bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header con botón de cerrar */}
          <div className="border-b border-[#e6b465]">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#7a0715] to-[#3b0012] text-white">
              <div className="w-6" />
              <h1 className="text-2xl font-bold">Información de reserva</h1>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="px-4 py-3 bg-gradient-to-r from-[#e6b465] to-[#c78418]">
              <h2 className="text-lg font-medium text-[#3b0012]">
                {instrument.name}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Left column - Simplified instrument details */}
            <div>
              <div className="space-y-6">
                {/* Imagen y descripción en la misma fila */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Imagen */}
                  <div className="w-full">
                    <img
                      src={instrument.imageUrls[0] || "/placeholder.svg"}
                      alt={instrument.title}
                      className="rounded-lg w-full h-full object-cover"
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <h3 className="font-semibold mb-2">Descripción</h3>
                    <p className="text-gray-600">{instrument.description}</p>
                  </div>
                </div>

                {/* Detalles técnicos (features) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-[#7a0715]">
                      Detalles técnicos
                    </h3>
                    {Object.entries(instrument.features).length > 2 && (
                      <button
                        onClick={() => setShowMoreFeatures(!showMoreFeatures)}
                        className="p-0 h-8 w-8 text-gray-500 hover:text-gray-700"
                      >
                        {showMoreFeatures ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-[#e6b465]/10 p-4 rounded-lg border border-[#c78418]/20">
                    {Object.entries(instrument.features)
                      .slice(0, showMoreFeatures ? undefined : 2)
                      .map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-sm text-gray-500 capitalize flex items-center gap-2">
                            {getIconForFeature(value)}
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Reservation details */}
            <div>
              <div className="sticky top-4 border border-[#e6b465] rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-[#7a0715]">
                    Detalles de la reserva
                  </h2>

                  {/* Price info */}
                  <div className="flex justify-between items-center mb-6 p-4 bg-[#e6b465]/10 rounded-lg">
                    <div>
                      <span className="text-lg">
                        ${instrument.price} por día
                      </span>
                      <p className="text-sm text-gray-500">
                        {totalDays} {totalDays === 1 ? "día" : "días"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Costo total</p>
                      <span className="font-bold text-xl">${totalPrice}</span>
                    </div>
                  </div>

                  {/* Date selection */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2 text-[#7a0715]">
                      Período de reserva
                    </h3>
                    <div className="p-4 bg-[#e6b465]/10 rounded-lg border border-[#c78418]/20">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <p className="text-sm text-gray-500">Desde</p>
                          <p className="font-medium">
                            {date.from
                              ? formatDate(date.from)
                              : "No seleccionado"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Hasta</p>
                          <p className="font-medium">
                            {date.to ? formatDate(date.to) : "No seleccionado"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duración</p>
                        <p className="font-medium">{totalDays} días</p>
                      </div>
                    </div>

                    {!isDateRangeValid() && (
                      <p className="text-red-500 text-sm mb-2">
                        Por favor seleccione un rango de fechas válido
                      </p>
                    )}

                    {/* Simple date picker implementation */}
                    <div className="border rounded-md p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Fecha de inicio
                          </label>
                          <input
                            type="date"
                            value={formatDateForInput(date.from)}
                            onChange={(e) => handleDateChange(e, "from")}
                            min={formatDateForInput(new Date())}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Fecha de fin
                          </label>
                          <input
                            type="date"
                            value={formatDateForInput(date.to)}
                            onChange={(e) => handleDateChange(e, "to")}
                            min={formatDateForInput(date.from || new Date())}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User info */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-[#7a0715]">
                        Información del usuario
                      </h3>
                      <button
                        onClick={() => setShowMoreUserInfo(!showMoreUserInfo)}
                        className="p-0 h-8 w-8 text-gray-500 hover:text-gray-700"
                      >
                        {showMoreUserInfo ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <div className="space-y-2 p-4 bg-[#e6b465]/10 rounded-lg border border-[#c78418]/20">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Nombre</p>
                          <p className="font-medium">
                            {user.firstName || "Anthony"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Apellido</p>
                          <p className="font-medium">
                            {user.lastName || "Smith"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {user.email || "anthony.smith@email.com"}
                        </p>
                      </div>

                      {showMoreUserInfo && (
                        <>
                          <div>
                            <p className="text-sm text-gray-500">Teléfono</p>
                            <p className="font-medium">
                              {user.phone || "+56 9 1234 5678"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Dirección</p>
                            <p className="font-medium">
                              {user.address || "Av. Providencia 1234, Santiago"}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleReservationSubmit}
                      className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                        isDateRangeValid()
                          ? "bg-gradient-to-r from-[#7a0715] to-[#3b0012] hover:shadow-lg hover:shadow-[#7a0715]/20 transform hover:-translate-y-0.5"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                      disabled={!isDateRangeValid()}
                    >
                      Confirmar reserva
                    </button>
                  </div>

                  <p className="text-xs text-[#3d2130] text-center mt-4">
                    No se realizará ningún cargo hasta confirmar la reserva
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationDetails;
