import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

// Sample instrument data - replace with your actual data
const instrument = {
  id: 1,
  title: "Yamaha C3X Grand Piano",
  location: "Conservatorio Nacional de Música, Santiago",
  price: 75,
  rating: 4.9,
  reviews: 128,
  description:
    "El Yamaha C3X es un piano de cola de concierto que ofrece un sonido excepcional y una respuesta táctil precisa. Perfecto para recitales, grabaciones y práctica profesional.",
  highlights: [
    "Piano de cola de concierto de 186cm",
    "Acabado en negro pulido",
    "Teclado de marfil sintético",
    "Sistema de pedales responsivo",
    "Afinado recientemente",
  ],
  details: {
    brand: "Yamaha",
    model: "C3X",
    year: "2019",
    condition: "Excelente",
    dimensions: "186cm x 149cm",
    weight: "320kg",
  },
  images: [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ],
};

// Sample user data - replace with actual user data
const user = {
  firstName: "Carlos",
  lastName: "Rodríguez",
  email: "carlos.rodriguez@email.com",
  phone: "+56 9 1234 5678",
  address: "Av. Providencia 1234, Santiago",
  profession: "Pianista",
  purpose: "Recital de graduación",
};

export default function ReservationDetails({ isOpen, onClose }) {
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 3)),
  });
  const [showMoreUserInfo, setShowMoreUserInfo] = useState(false);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header con botón de cerrar */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">{instrument.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Left column - Simplified instrument details */}
          <div>
            <div className="space-y-6">
              {/* Una sola imagen principal */}
              <div className="w-full">
                <img
                  src={instrument.images[0] || "/placeholder.svg"}
                  alt={instrument.title}
                  className="rounded-lg w-full h-64 object-cover"
                />
              </div>

              {/* Descripción */}
              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-gray-600">{instrument.description}</p>
              </div>

              {/* Detalles */}
              <div>
                <h3 className="font-semibold mb-2">Detalles técnicos</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  {Object.entries(instrument.details).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm text-gray-500 capitalize">
                        {key}
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
            <div className="sticky top-4 border rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  Detalles de la reserva
                </h2>

                {/* Price info */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg">${instrument.price} por día</span>
                  <span className="font-bold text-xl">${totalPrice}</span>
                </div>

                {/* User info */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Información del usuario</h3>
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
                  <div className="space-y-2 p-3 bg-gray-100 rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Nombre</p>
                        <p className="font-medium">Carlos</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Apellido</p>
                        <p className="font-medium">Rodríguez</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">carlos.rodriguez@email.com</p>
                    </div>

                    {showMoreUserInfo && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Teléfono</p>
                          <p className="font-medium">+56 9 1234 5678</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Dirección</p>
                          <p className="font-medium">
                            Av. Providencia 1234, Santiago
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Profesión</p>
                          <p className="font-medium">Pianista</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Propósito</p>
                          <p className="font-medium">Recital de graduación</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Date selection */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Período de reserva</h3>
                  <div className="p-3 bg-gray-100 rounded-md mb-2">
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

                {/* Submit button */}
                <button
                  className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                    isDateRangeValid()
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-300 cursor-not-allowed"
                  }`}
                  disabled={!isDateRangeValid()}
                >
                  Confirmar reserva
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  No se realizará ningún cargo hasta confirmar la reserva
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
