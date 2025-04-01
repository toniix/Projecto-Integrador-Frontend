/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";
import ProductFeatures from "../components/ProductFeatures/ProductFeatures";
import ProductPolicies from "../components/ProductPolicies/ProductPolicies";
import AvailabilityCalendar from "../components/common/AvailabilityCalendar";
import { CircleArrowLeft } from "lucide-react";
import ShareInstrument from "../components/share/ShareInstrument";
import { Share, Calendar } from "lucide-react";
import { productPolicies } from "../utils/instrumentPolicies";
import ReservationDetails from "../components/reservation/ReservationDetails";
import WhatsAppChatButton from "../components/common/WhatsAppChatButton";
import { useAuth } from "../context";
import AuthRequiredModal from "../components/modals/AuthRequiredModal";
const API_URL = import.meta.env.VITE_API_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  // Función para abrir el modal
  const openShareModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeShareModal = () => {
    setIsModalOpen(false);
    setSelectedNetwork(null);
  };

  const handleReservationClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setIsReservationModalOpen(true);
  };

  // Función para obtener características según el nombre del producto (esto luego deberíamos cambiarlo por información de la API)
  const getFallbackFeatures = (product) => {
    const name = product.name?.toLowerCase() || "";
    if (name.includes("timbal") && name.includes("cencerro")) {
      return [
        "Marca: LP Aspire",
        "Tipo: timbal",
        "Tamaño: estándar",
        "Material: Aluminio y parches PET",
        "Mecanismo: percusión",
        "Producto: instrumento musical",
      ];
    } else if (name.includes("platillos")) {
      return [
        "Marca: Sabian",
        "Tipo: platillos",
        "Tamaño: estándar",
        "Material: cobre",
        "Mecanismo: percusión",
        "Producto: instrumento musical",
      ];
    } else if (name.includes("batería eléctrica")) {
      return [
        "Marca: Mapex",
        "Tipo: Batería",
        "Tamaño: Grande",
        "Material: Aluminio y parches PET",
        "Mecanismo: percusión",
        "Producto: instrumento musical",
      ];
    } else if (name.includes("sintetizador")) {
      return [
        "Marca: Kross",
        "Tipo: Sintetizador",
        "Tamaño: compacto",
        "Material: Vinilo, ABS y aluminio",
        "Mecanismo: Digital",
        "Producto: instrumento musical",
      ];
    } else if (name.includes("teclado")) {
      return [
        "Marca: Yamaha",
        "Tipo: teclado",
        "Tamaño: estándar",
        "Material: aluminio",
        "Mecanismo: cuerda",
        "Producto: instrumento musical",
      ];
    } else if (name.includes("marimba")) {
      return [
        "Marca: Tonson",
        "Tipo: diatónica",
        "Tamaño: compacto",
        "Material: pino",
        "Mecanismo: percusión",
        "Producto: instrumento musical",
      ];
    } else if (name.includes("maracas")) {
      return [
        "Marca: Yamaha",
        "Tipo: sonajeros",
        "Tamaño: pequeño",
        "Material: plástico ABS y madera",
        "Mecanismo: percusión",
        "Producto: instrumento musical",
      ];
    } else if (name.includes("guitarra eléctrica stratocaster")) {
      return [
        "Marca: Stratocaster",
        "Tipo: eléctrica",
        "Tamaño: estándar",
        "Material: fibra de carbono y madera",
        "Mecanismo: cuerda",
        "Producto: instrumento musical",
      ];
    } else if (name.includes("guitarra eléctrica")) {
      return [
        "Marca: Gibson",
        "Tipo: eléctrica",
        "Tamaño: estándar",
        "Material: caoba y aluminio",
        "Mecanismo: cuerda",
        "Producto: instrumento musical",
      ];
    } else if (name.includes("guitarra acústica")) {
      return [
        "Marca: Vibra",
        "Tipo: acústica",
        "Tamaño: estándar",
        "Material: caoba",
        "Mecanismo: cuerda",
        "Producto: instrumento musical",
      ];
    } else if (name.includes("viola")) {
      return [
        "Marca: stentor",
        "Tipo: acústico",
        "Tamaño: pequeña",
        "Material: pino",
        "Mecanismo: cuerda",
        "Producto: instrumento musical",
      ];
    } else if (name.includes("trompeta")) {
      return [
        "Marca: Eastrock",
        "Tipo: piccolo",
        "Tamaño: estándar",
        "Material: aluminio",
        "Mecanismo: viento",
        "Producto: instrumento musical",
      ];
    } else if (name.includes("acordeon")) {
      return [
        "Marca: Yingwu",
        "Tipo: acordeon",
        "Tamaño: estándar",
        "Material: Aluminio",
        "Mecanismo: Cuerda y viento",
        "Producto: instrumento musical",
      ];
    } else {
      return ["Característica genérica", "Producto: instrumento musical"];
    }
  };

  // Función para obtener políticas según el nombre del producto
  const getFallbackPolicies = (product) => {
    const name = product.name?.toLowerCase() || "";

    if (name.includes("timbal") || name.includes("cencerro")) {
      return productPolicies.timbal;
    } else if (name.includes("platillos")) {
      return productPolicies.platillos;
    } else if (name.includes("batería") || name.includes("bateria")) {
      return productPolicies.bateria;
    } else if (name.includes("sintetizador")) {
      return productPolicies.sintetizador;
    } else if (name.includes("teclado")) {
      return productPolicies.teclado;
    } else if (name.includes("marimba")) {
      return productPolicies.marimba;
    } else if (name.includes("maracas")) {
      return productPolicies.maracas;
    } else if (
      name.includes("guitarra eléctrica") ||
      name.includes("guitarra electrica") ||
      name.includes("stratocaster")
    ) {
      return productPolicies.guitarra_electrica;
    } else if (
      name.includes("guitarra acústica") ||
      name.includes("guitarra acustica")
    ) {
      return productPolicies.guitarra_acustica;
    } else if (name.includes("viola")) {
      return productPolicies.viola;
    } else if (name.includes("trompeta")) {
      return productPolicies.trompeta;
    } else if (name.includes("acordeon") || name.includes("acordeón")) {
      return productPolicies.acordeon;
    } else {
      // Políticas genéricas para cualquier instrumento no identificado
      return [
        {
          nombre: "Cuidado y Mantenimiento",
          descripcion: "Mantén el instrumento limpio y en buenas condiciones.",
        },
        {
          nombre: "Uso Adecuado",
          descripcion:
            "Utiliza el instrumento según las indicaciones del fabricante.",
        },
        {
          nombre: "Almacenamiento y Transporte",
          descripcion: "Guarda el instrumento en un lugar seguro y protegido.",
        },
        {
          nombre: "Responsabilidad del Usuario",
          descripcion:
            "Devuelve el instrumento en las mismas condiciones en que fue entregado.",
        },
        {
          nombre: "Reparación y Daños",
          descripcion:
            "Reporta cualquier daño inmediatamente. No intentes reparaciones por tu cuenta.",
        },
        {
          nombre: "Condiciones de Devolución",
          descripcion:
            "El instrumento debe devolverse limpio, con todos sus accesorios y sin daños.",
        },
      ];
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        const apiProduct = response.data.response;
        setProduct({
          ...apiProduct,
          features: apiProduct.features || getFallbackFeatures(apiProduct),
          policies: apiProduct.policies || getFallbackPolicies(apiProduct),
        });
      } catch (error) {
        console.error("Error al obtener el detalle del producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  console.log(product);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#730f06]"></div>
        <p className="text-2xl">Cargando...</p>
      </div>
    );
  }

  if (!product) return <div>Loading...</div>;

  const productImages = product.imageUrls;
  const previewImages = productImages.slice(1, 5);

  // Función para abrir la galería en la imagen seleccionada
  const openGallery = (index = 0) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  // Función para cerrar la galería
  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  // Función para cambiar de imagen
  const changeImage = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      if (newIndex < 0) return productImages.length - 1;
      if (newIndex >= productImages.length) return 0;
      return newIndex;
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen pt-28 relative">
      {/* Header Container */}
      <div className="w-full bg-white mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Título y botón de volver */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-[#ffffff0a] transition-colors text-[#730f06] hover:text-[#b08562]"
            >
              <CircleArrowLeft size={28} className="sm:w-8 sm:h-8" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#2a0803] leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-3">
            <button
              onClick={openShareModal}
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl
                border-2 border-[#730f06] text-[#730f06] text-sm sm:text-base font-medium
                hover:bg-[#730f06]/5 transition-all duration-300
                transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Share size={18} className="sm:w-5 sm:h-5" />
              <span>Compartir</span>
            </button>

            <button
              onClick={handleReservationClick}
              className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl
                bg-gradient-to-r from-[#730f06] to-[#b08562] text-white text-sm sm:text-base font-medium
                hover:from-[#8b1208] hover:to-[#c49573]
                transform hover:-translate-y-0.5 transition-all duration-300
                hover:shadow-lg shadow-md"
            >
              <Calendar size={18} className="sm:w-5 sm:h-5" />
              <span>Reservar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Galería de imágenes */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Imagen principal */}
        <div className="flex-1">
          <img
            src={productImages[0]}
            alt={product.name}
            className="w-100 h-100 object-cover rounded-xl shadow-lg hover:opacity-75"
            onClick={() => openGallery(0)}
          />
        </div>

        {/* Grilla de imágenes secundarias */}
        <div className="grid grid-cols-2 gap-4 flex-1 relative">
          {[
            ...previewImages,
            ...(previewImages.length < 4 ? [productImages[0]] : []),
          ].map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} ${index}`}
              className="w-full h-full object-cover rounded-xl  shadow-md cursor-pointer hover:opacity-75"
              onClick={() => openGallery(index + 1)}
            />
          ))}
          <button
            className="absolute bottom-4 right-4 px-6 py-2 bg-[#7a0715]/90 text-[#ffffff] rounded-xl hover:bg-[#604152] shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
            onClick={() => openGallery(0)}
          >
            Ver galería
          </button>
        </div>
      </div>

      {/* Descripción y detalles */}
      <div className="flex justify-between items-center my-4">
        <div className="flex-col my-4 mr-6">
          <p className="text-2xl">Descripción</p>
          <p className="text-gray-700 mt-2">{product.description}</p>
        </div>

        <div className="flex-col justify-items-end my-4 ml-6">
          <p className="text-5xl text-[#C78418] mt-2">${product.price}</p>
          <p className="text-xs text-gray-600 whitespace-nowrap mt-2">
            Unidades disponibles: {product.stock}
          </p>
        </div>
      </div>

      <ProductFeatures features={product.features} />
      <ProductPolicies policies={product.policies} />
      <AvailabilityCalendar productId={id} productStock={product.stock} />

      {/* Modal de galería */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            onClick={closeGallery}
            className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300"
          >
            ✖
          </button>
          <button
            onClick={() => changeImage(-1)}
            className="absolute left-10 text-white text-4xl hover:text-gray-300"
          >
            ◀
          </button>
          <img
            src={productImages[currentImageIndex]}
            alt={`Imagen ${currentImageIndex}`}
            className="max-w-[80%] max-h-[80%] rounded-lg shadow-lg"
          />
          <button
            onClick={() => changeImage(1)}
            className="absolute right-10 text-white text-4xl hover:text-gray-300"
          >
            ▶
          </button>
        </div>
      )}

      {/* Modal de compartir */}
      {isModalOpen && (
        <ShareInstrument product={product} closeModal={closeShareModal} />
      )}

      {/* Modal de reserva */}
      {isReservationModalOpen && (
        <ReservationDetails
          instrument={product}
          isOpen={isReservationModalOpen}
          onClose={() => setIsReservationModalOpen(false)}
        />
      )}

      {/* Auth Required Modal */}
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* WhatsApp Chat Button */}
      <WhatsAppChatButton
        phoneNumber="1234567890"
        prefilledMessage="Hola, me gustaría obtener más información sobre la reserva de instrumentos."
      />
    </div>
  );
};

export default ProductDetail;
