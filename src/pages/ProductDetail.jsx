/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";
import ProductFeatures from "../components/ProductFeatures/ProductFeatures";
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Función para obtener características de fallback según el nombre del producto
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://clavecompas-production.up.railway.app/clavecompas/products/${id}`
        );
        const apiProduct = response.data.response;
        setProduct({
          ...apiProduct,
          features: apiProduct.features || getFallbackFeatures(apiProduct),
        });
      } catch (error) {
        console.error("Error al obtener el detalle del producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  const productImages = product.imageUrls || [];
  const previewImages = productImages.slice(1, 5);

  const openGallery = (index = 0) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-3xl hover:text-gray-700"
        >
          <img src="/img/back-button.png" alt="Volver" className="w-8 h-8" />
        </button>
      </div>

      <p className="text-gray-700 mt-2">{product.description}</p>
      <p className="mt-2 font-semibold text-lg">
        Precio por unidad:{" "}
        <span className="text-red-600"> ${product.price}</span>
      </p>
      <p className="text-gray-600">Unidades disponibles: {product.stock}</p>

      {/* GALERÍA DE IMÁGENES */}
      <div className="mt-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <img
            src={productImages[0]}
            alt={product.name}
            className="w-100 h-100 object-cover rounded-xl shadow-md hover:opacity-75"
            onClick={() => openGallery(0)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 flex-1">
          {[
            ...previewImages,
            ...(previewImages.length < 4 ? [productImages[0]] : []),
          ].map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} ${index}`}
              className="w-full h-full object-cover rounded-xl shadow-md cursor-pointer hover:opacity-75"
              onClick={() => openGallery(index + 1)}
            />
          ))}
          <button
            className="w-full px-6 py-2 bg-[#B08562] text-[#1E1E1E] font-semibold rounded-lg hover:bg-[#D9C6B0]"
            onClick={() => openGallery(0)}
          >
            Ver galería
          </button>
          <button className="w-full px-6 py-2 bg-[#730F06] text-[#D4BDA8] font-semibold rounded-lg hover:bg-red-800">
            Reservar
          </button>
        </div>
      </div>

      {/* BLOQUE DE CARACTERÍSTICAS, CON FONDO = COLOR DEL BOTÓN "VER GALERÍA" */}
      <ProductFeatures features={product.features} />

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
    </div>
  );
};

export default ProductDetail;
