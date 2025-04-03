import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import whatsappLogo from "../../../public/img/wts-logo.png";

export default function WhatsAppChatButton({
  phoneNumber,
  prefilledMessage = "Hola, me gustaría obtener más información sobre la reserva de instrumentos.",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  1;
  const handleWhatsAppClick = () => {
    try {
      // Format phone number (remove any non-numeric characters)
      const formattedNumber = phoneNumber.replace(/\D/g, "");

      if (!formattedNumber || formattedNumber.length < 8) {
        throw new Error("Número de teléfono inválido");
      }

      // Encode message for URL
      const message = encodeURIComponent(prefilledMessage);

      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, "_blank");

      // Show success notification
      toast({
        type: "success",
        message: "Redirigiendo a WhatsApp para iniciar la conversación.",
        // variant: "default",
      });

      setIsOpen(false);
    } catch (error) {
      // Handle errors
      toast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo conectar con WhatsApp. Intente nuevamente.",
        // variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
        {isOpen && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-2 w-72 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">
                Contactar por WhatsApp
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Inicia una conversación con nosotros para obtener más información
              sobre la reserva de instrumentos.
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <img src={whatsappLogo} alt="WhatsApp" className="w-5 h-5 mr-2" />
              Iniciar chat
            </button>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white hover:bg-gray-100 text-green-500 p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
          aria-label="Chat por WhatsApp"
        >
          <img src={whatsappLogo} alt="WhatsApp" className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
