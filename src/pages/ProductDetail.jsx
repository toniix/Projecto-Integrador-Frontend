/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";
import ProductFeatures from "../components/ProductFeatures/ProductFeatures";
import ProductPolicies from "../components/ProductPolicies/ProductPolicies";
import AvailabilityCalendar from "../components/common/AvailabilityCalendar";
import { CircleArrowLeft } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  // Políticas de uso para cada tipo de instrumento (esto -también- deberíamos cambiarlo más adelante por información traida de la API)
  const productPolicies = {
    timbal: [
      { nombre: "Cuidado y Mantenimiento", descripcion: "Limpia la membrana con un paño seco después de cada uso y evita golpear con baquetas inadecuadas." },
      { nombre: "Uso Adecuado", descripcion: "No uses baquetas demasiado duras para evitar daños en la membrana." },
      { nombre: "Almacenamiento y Transporte", descripcion: "Guarda en una funda acolchada para evitar golpes durante el transporte." },
      { nombre: "Responsabilidad del Usuario", descripcion: "Devuelve el instrumento en las mismas condiciones en que fue entregado." },
      { nombre: "Reparación y Daños", descripcion: "En caso de daño, informa de inmediato. No intentes reparaciones por cuenta propia." },
      { nombre: "Condiciones de Devolución", descripcion: "El timbal debe devolverse limpio y sin alteraciones estructurales." }
    ],
    platillos: [
      { nombre: "Cuidado y Mantenimiento", descripcion: "Usa baquetas de punta de fieltro y evita tocar con las manos desnudas para prevenir la oxidación." },
      { nombre: "Uso Adecuado", descripcion: "No golpees con fuerza excesiva ni uses objetos metálicos para tocarlos." },
      { nombre: "Almacenamiento y Transporte", descripcion: "Usa fundas individuales para evitar rayaduras entre ellos." },
      { nombre: "Responsabilidad del Usuario", descripcion: "Reporta cualquier abolladura o daño antes de devolverlos." },
      { nombre: "Reparación y Daños", descripcion: "Los platillos dañados por un uso inadecuado serán responsabilidad del usuario." },
      { nombre: "Condiciones de Devolución", descripcion: "Se debe devolver sin rajaduras y con su funda protectora." }
    ],
    bateria: [
      { nombre: "Cuidado y Mantenimiento", descripcion: "Ajusta la tensión de los parches regularmente y limpia las piezas metálicas con un paño seco." },
      { nombre: "Uso Adecuado", descripcion: "Ajusta los pedales a una tensión cómoda y evita golpes innecesarios en la estructura." },
      { nombre: "Almacenamiento y Transporte", descripcion: "Desmonta los tambores y pedales antes de transportarla para mayor seguridad." },
      { nombre: "Responsabilidad del Usuario", descripcion: "No alteres la configuración original sin autorización." },
      { nombre: "Reparación y Daños", descripcion: "En caso de rotura de parches o piezas, deberá reponerse con piezas originales." },
      { nombre: "Condiciones de Devolución", descripcion: "Todos los elementos de la batería deben devolverse sin modificaciones." }
    ],
    sintetizador: [
      { nombre: "Cuidado y Mantenimiento", descripcion: "Mantén el equipo alejado del polvo y la humedad; usa protectores para los conectores." },
      { nombre: "Uso Adecuado", descripcion: "No sobrecargues la memoria del dispositivo con demasiados efectos simultáneamente." },
      { nombre: "Almacenamiento y Transporte", descripcion: "Usa un estuche rígido y evita impactos en la pantalla y los controles." },
      { nombre: "Responsabilidad del Usuario", descripcion: "No instales software no autorizado ni modifiques la programación." },
      { nombre: "Reparación y Daños", descripcion: "No intentes abrir ni reparar el sintetizador; cualquier fallo debe ser informado." },
      { nombre: "Condiciones de Devolución", descripcion: "Debe devolverse con el adaptador y cables originales en buen estado." }
    ],
    teclado: [
      { nombre: "Cuidado y Mantenimiento", descripcion: "No presiones las teclas con fuerza excesiva y limpia con un paño seco para evitar la acumulación de suciedad." },
      { nombre: "Uso Adecuado", descripcion: "Usa solo adaptadores de corriente compatibles para evitar daños eléctricos." },
      { nombre: "Almacenamiento y Transporte", descripcion: "Transporta siempre en un estuche acolchado y evita la exposición prolongada al sol." },
      { nombre: "Responsabilidad del Usuario", descripcion: "No dejes conectado el adaptador de corriente cuando no esté en uso." },
      { nombre: "Reparación y Daños", descripcion: "No intentes abrir el teclado; reporta cualquier mal funcionamiento." },
      { nombre: "Condiciones de Devolución", descripcion: "Debe devolverse con el cable de alimentación y sin teclas dañadas." }
    ],
    marimba: [
      { nombre: "Cuidado y Mantenimiento", descripcion: "Usa mazos adecuados y evita la exposición prolongada al sol o la humedad." },
      { nombre: "Uso Adecuado", descripcion: "No golpees con baquetas de madera dura, ya que pueden dañar las láminas." },
      { nombre: "Almacenamiento y Transporte", descripcion: "Mantén en un lugar seco y cubre con una funda cuando no esté en uso." },
      { nombre: "Responsabilidad del Usuario", descripcion: "No prestes el instrumento a terceros sin permiso." },
      { nombre: "Reparación y Daños", descripcion: "Las láminas dañadas deberán ser reemplazadas con materiales de calidad equivalente." },
      { nombre: "Condiciones de Devolución", descripcion: "Debe devolverse con sus mazos originales y sin fisuras." }
    ],
    maracas: [
      { nombre: "Cuidado y Mantenimiento", descripcion: "Limpia con un paño seco y evita el contacto con la humedad para prevenir deformaciones." },
      { nombre: "Uso Adecuado", descripcion: "No golpees las maracas contra superficies duras para evitar que se agrieten." },
      { nombre: "Almacenamiento y Transporte", descripcion: "Guarda en una bolsa acolchada para evitar golpes y cambios de temperatura." },
      { nombre: "Responsabilidad del Usuario", descripcion: "Utiliza las maracas con cuidado y evita caídas accidentales." },
      { nombre: "Reparación y Daños", descripcion: "Si una maraca se rompe, deberá ser reemplazada por una de características similares." },
      { nombre: "Condiciones de Devolución", descripcion: "Las maracas deben devolverse sin fisuras ni grietas visibles." }
    ],
    guitarra_electrica: [
      { nombre: "Cuidado y Mantenimiento", descripcion: "Limpia el cuerpo con un paño de microfibra y cambia las cuerdas periódicamente." },
      { nombre: "Uso Adecuado", descripcion: "No uses púas extremadamente duras que puedan dañar el diapasón." },
      { nombre: "Almacenamiento y Transporte", descripcion: "Guarda en un estuche rígido para evitar golpes y daños en el clavijero." },
      { nombre: "Responsabilidad del Usuario", descripcion: "No alteres la electrónica interna ni realices modificaciones sin autorización." },
      { nombre: "Reparación y Daños", descripcion: "Cualquier falla en el sistema eléctrico debe ser reportada de inmediato." },
      { nombre: "Condiciones de Devolución", descripcion: "Debe devolverse con sus cables y correa original sin rayaduras graves." }
    ],
    guitarra_acustica: [
      { nombre: "Cuidado y Mantenimiento", descripcion: "Limpia las cuerdas después de cada uso y evita golpes en la caja de resonancia." },
      { nombre: "Uso Adecuado", descripcion: "No expongas la guitarra a cambios bruscos de temperatura que puedan deformar la madera." },
      { nombre: "Almacenamiento y Transporte", descripcion: "Guarda en una funda acolchada para protegerla de golpes y humedad." },
      { nombre: "Responsabilidad del Usuario", descripcion: "Evita tocar con anillos u objetos que puedan rayar el acabado." },
      { nombre: "Reparación y Daños", descripcion: "Las roturas en el mástil o el cuerpo deberán ser evaluadas para su reposición." },
      { nombre: "Condiciones de Devolución", descripcion: "Debe devolverse con el puente y clavijas en buen estado." }
    ],
    viola: [
      { nombre: "Cuidado y Mantenimiento", descripcion: "Limpia la resina del arco regularmente y mantén la viola en un ambiente seco." },
      { nombre: "Uso Adecuado", descripcion: "No aprietes excesivamente el arco para evitar tensiones dañinas en las cerdas." },
      { nombre: "Almacenamiento y Transporte", descripcion: "Guarda en su estuche rígido con el arco correctamente asegurado." },
      { nombre: "Responsabilidad del Usuario", descripcion: "No dejes la viola expuesta a golpes o caídas accidentales." },
      { nombre: "Reparación y Daños", descripcion: "En caso de fisuras en la caja de resonancia, será necesaria una reparación especializada." },
      { nombre: "Condiciones de Devolución", descripcion: "Debe devolverse con el arco en buenas condiciones y sin daños estructurales." }
    ],
    trompeta: [
      { nombre: "Cuidado y Mantenimiento", descripcion: "Limpia las válvulas con aceite especial y evita la acumulación de humedad interna." },
      { nombre: "Uso Adecuado", descripcion: "No fuerces las válvulas ni los pistones para evitar obstrucciones." },
      { nombre: "Almacenamiento y Transporte", descripcion: "Guarda en su estuche con las boquillas y accesorios bien asegurados." },
      { nombre: "Responsabilidad del Usuario", descripcion: "No compartas la boquilla sin una correcta limpieza previa." },
      { nombre: "Reparación y Daños", descripcion: "Cualquier abolladura o mal funcionamiento de los pistones debe ser reportado." },
      { nombre: "Condiciones de Devolución", descripcion: "Debe devolverse sin abolladuras y con todas sus partes originales." }
    ],
    acordeon: [
      { nombre: "Cuidado y Mantenimiento", descripcion: "Limpia el fuelle con un paño seco y evita la exposición a la humedad." },
      { nombre: "Uso Adecuado", descripcion: "No fuerces el fuelle más allá de su apertura natural para evitar desgarros." },
      { nombre: "Almacenamiento y Transporte", descripcion: "Mantén en su estuche cerrado cuando no esté en uso para protegerlo del polvo." },
      { nombre: "Responsabilidad del Usuario", descripcion: "No permitas golpes en el fuelle ni presiones indebidas sobre las teclas." },
      { nombre: "Reparación y Daños", descripcion: "Si se detecta una fuga de aire en el fuelle, debe ser reparado por un especialista." },
      { nombre: "Condiciones de Devolución", descripcion: "Debe devolverse con todas sus teclas funcionales y sin daños en el fuelle." }
    ]
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
      } else if (name.includes("guitarra eléctrica") || name.includes("guitarra electrica") || name.includes("stratocaster")) {
        return productPolicies.guitarra_electrica;
      } else if (name.includes("guitarra acústica") || name.includes("guitarra acustica")) {
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
          { nombre: "Cuidado y Mantenimiento", descripcion: "Mantén el instrumento limpio y en buenas condiciones." },
          { nombre: "Uso Adecuado", descripcion: "Utiliza el instrumento según las indicaciones del fabricante." },
          { nombre: "Almacenamiento y Transporte", descripcion: "Guarda el instrumento en un lugar seguro y protegido." },
          { nombre: "Responsabilidad del Usuario", descripcion: "Devuelve el instrumento en las mismas condiciones en que fue entregado." },
          { nombre: "Reparación y Daños", descripcion: "Reporta cualquier daño inmediatamente. No intentes reparaciones por tu cuenta." },
          { nombre: "Condiciones de Devolución", descripcion: "El instrumento debe devolverse limpio, con todos sus accesorios y sin daños." }
        ];      
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
      <div className="flex justify-between items-center mt-4 mb-5">
        {/* Nombre del producto */}
        <h1 className="text-5xl text-gray-900">{product.name}</h1>

        {/* Botón para volver */}
        <button
          onClick={() => navigate(-1)}
          className="hover:text-gray-700"
        >
          <CircleArrowLeft size={32} />
        </button>
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
        <div className="grid grid-cols-2 gap-4 flex-1">
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
            className="w-full px-6 py-2 bg-[#3D2130] text-[#ffffff] rounded-xl hover:bg-[#604152]"
            onClick={() => openGallery(0)}
          >
            Ver galería
          </button>
          <button className="w-full px-6 py-2 bg-[#7A0715] text-[#ffffff] font-semibold rounded-xl hover:bg-[#B32C3A]">
            Reservar
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
          <p className="text-5xl text-[#C78418] mt-2">
            ${product.price}
          </p>
          <p className="text-xs text-gray-600 whitespace-nowrap mt-2">Unidades disponibles: {product.stock}</p>
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
    </div>
  );
};

export default ProductDetail;
