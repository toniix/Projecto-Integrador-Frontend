import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faWhatsapp,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import { X } from "lucide-react";
import { successToast } from "../../utils/toastNotifications";

const ShareInstrument = ({ product, closeModal }) => {
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [shareMessage, setShareMessage] = useState(
    "¡Mira este increíble instrumento que encontré!"
  );

  // Función para seleccionar una red social
  const selectSocialNetwork = (network) => {
    setSelectedNetwork(network);
  };

  // Función para compartir en la red social seleccionada
  const shareContent = () => {
    if (!selectedNetwork) return;

    const message =
      shareMessage || "¡Mira este increíble instrumento que encontré!";

    let shareUrl = "";
    const currentUrl = encodeURIComponent(window.location.href);

    switch (selectedNetwork) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          window.location.href
        )}&quote=${encodeURIComponent(message)}`;
        break;

      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          message
        )}&url=${currentUrl}`;
        break;

      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          message + " " + window.location.href
        )}`;
        break;

      case "telegram":
        shareUrl = `https://t.me/share/url?url=${currentUrl}&text=${encodeURIComponent(
          message
        )}`;
        break;

      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
        break;

      case "instagram":
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert(
            "El enlace ha sido copiado. Puedes pegarlo en tu historia de Instagram."
          );
        });
        return;

      default:
        alert("Red social no soportada.");
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank"); // Removidos los parámetros de dimensiones
    }

    successToast(`¡Contenido compartido exitosamente en ${selectedNetwork}!`);
    // alert(`¡Contenido compartido exitosamente en ${selectedNetwork}!`);
    closeModal();
  };

  // Componente para los botones de redes sociales
  const SocialButton = ({ network, icon, name }) => (
    <div
      className={`flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-1 ${
        selectedNetwork && selectedNetwork !== network
          ? "opacity-50"
          : "opacity-100"
      }`}
      onClick={() => selectSocialNetwork(network)}
    >
      <div
        className={`w-12 h-12 rounded-full flex justify-center items-center text-white mb-1 ${getSocialColor(
          network
        )}`}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      <span className="text-xs text-gray-600">{name}</span>
    </div>
  );

  // Actualizamos los colores de las redes sociales para que coincidan con la paleta
  const getSocialColor = (network) => {
    switch (network) {
      case "facebook":
        return "bg-[#3e0b05]";
      case "twitter":
        return "bg-[#730f06]";
      case "instagram":
        return "bg-[#b08562]";
      case "whatsapp":
        return "bg-[#3e0b05]";
      case "telegram":
        return "bg-[#730f06]";
      default:
        return "bg-[#757575]";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#1e1e1e]/70 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-[#F9F7F4] rounded-xl w-11/12 max-w-md p-8 relative border border-[#d9c6b0] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-[#757575] hover:text-[#3e0b05] transition-colors"
          onClick={closeModal}
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold mb-6 text-[#3e0b05]">
          Compartir este instrumento
        </h3>

        <div className="flex bg-white p-4 rounded-lg mb-6 border border-[#d9c6b0]">
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-28 h-28 object-cover rounded-lg shadow-sm mr-4"
          />
          <div>
            <p className="font-bold text-[#3e0b05]">{product.name}</p>
            <p className="text-sm text-[#757575] line-clamp-2 mb-2">
              {product.description}
            </p>
            <p className="text-xs text-[#730f06] break-all">{product.url}</p>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="share-message"
            className="block mb-2 text-[#3e0b05] font-medium"
          >
            Mensaje personalizado:
          </label>
          <textarea
            id="share-message"
            className="w-full p-3 bg-white border border-[#d9c6b0] rounded-lg resize-none min-h-[100px] 
                     focus:ring-2 focus:ring-[#b08562] focus:border-transparent transition-all
                     text-[#1e1e1e] placeholder-[#757575]"
            placeholder="¡Mira este increíble instrumento que encontré!"
            value={shareMessage}
            onChange={(e) => setShareMessage(e.target.value)}
          />
        </div>

        <div className="flex justify-between mb-8 px-4">
          <SocialButton network="facebook" icon={faFacebookF} name="Facebook" />
          <SocialButton network="twitter" icon={faTwitter} name="Twitter" />
          <SocialButton
            network="instagram"
            icon={faInstagram}
            name="Instagram"
          />
          <SocialButton network="whatsapp" icon={faWhatsapp} name="WhatsApp" />
          <SocialButton network="telegram" icon={faTelegram} name="Telegram" />
        </div>

        <div className="flex justify-center">
          <button
            className={`font-bold py-3 px-8 rounded-lg transition-all ${
              selectedNetwork
                ? "bg-[#730f06] hover:bg-[#3e0b05] text-[#F9F7F4] shadow-md"
                : "bg-[#d9c6b0] text-[#757575] cursor-not-allowed"
            }`}
            disabled={!selectedNetwork}
            onClick={shareContent}
          >
            {selectedNetwork
              ? `Compartir en ${
                  selectedNetwork.charAt(0).toUpperCase() +
                  selectedNetwork.slice(1)
                }`
              : "Selecciona una red social"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareInstrument;
