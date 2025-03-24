import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import favoritesService from "../../services/favoritesService";
import { successToast } from "../../utils/toastNotifications";

/**
 * Componente de botón para marcar/desmarcar favoritos
 * @param {Object} props - Propiedades del componente
 * @param {number|string} props.productId - ID del producto
 */
const FavoriteButton = ({ productId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  // Función para verificar el estado de favorito
  const checkFavoriteStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setIsLoading(true);
      const status = await favoritesService.checkFavoriteStatus(productId);
      setIsFavorite(status);
    } catch (error) {
      console.error("Error al verificar estado de favorito:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar estado inicial al cargar el componente
  useEffect(() => {
    checkFavoriteStatus();
  }, [productId]);

  // Escuchar el evento de actualización de favoritos
  useEffect(() => {
    const handleRefreshFavorites = () => {
      console.log(
        "Recibido evento refresh-favorites para productId:",
        productId
      );
      checkFavoriteStatus();
    };

    const handleUserLoggedOut = () => {
      console.log("Usuario cerró sesión, limpiando estado de favorito");
      setIsFavorite(false); // Resetear el estado a "no favorito"
    };

    // Registrar listeners
    window.addEventListener("refresh-favorites", handleRefreshFavorites);
    window.addEventListener("user-logged-out", handleUserLoggedOut);

    // Limpiar listeners al desmontar
    return () => {
      window.removeEventListener("refresh-favorites", handleRefreshFavorites);
      window.removeEventListener("user-logged-out", handleUserLoggedOut);
    };
  }, [productId]);

  /**
   * Gestiona el toggle de favorito
   */
  const toggleFavorite = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Verificación directa del token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para guardar favoritos");
      return;
    }

    if (!productId) {
      console.error("ID de producto no válido");
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        await favoritesService.removeFromFavorites(productId);
        // Emitir evento para notificar que se ha eliminado un favorito
        window.dispatchEvent(
          new CustomEvent("favorite-removed", {
            detail: { productId: Number(productId) },
          })
        );
        successToast("Instrumento eliminado de favoritos");
      } else {
        await favoritesService.addToFavorites(productId);

        // Emitir evento para notificar que se ha añadido un favorito
        window.dispatchEvent(
          new CustomEvent("favorite-added", {
            detail: { productId: Number(productId) },
          })
        );
        successToast("Instrumento añadido a favoritos");
      }

      // Actualizar estado local
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
      // Si el error es de autorización, actualizamos el estado de autenticación
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token"); // Eliminar el token inválido
        setIsAuthenticated(false);
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else {
        alert("No se pudo actualizar el favorito. Intenta de nuevo más tarde.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizamos el botón solo si productId es válido
  if (!productId) {
    return null; // No renderizamos nada si no hay ID válido
  }

  // El resto del componente permanece igual
  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors duration-300 z-10"
      title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      {isLoading ? (
        // Indicador de carga
        <div className="w-5 h-5 border-2 border-[#7a0715] border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={isFavorite ? "#7a0715" : "none"}
          stroke={isFavorite ? "#7a0715" : "#3b0012"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors duration-300"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      )}
    </button>
  );
};

FavoriteButton.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default FavoriteButton;
