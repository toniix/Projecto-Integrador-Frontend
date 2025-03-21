// src/pages/FavoritesPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import favoritesService from "../services/favoritesService";
import Card from "../components/cards/Card";
import Button from "../components/common/Button";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar favoritos al montar el componente
  useEffect(() => {
    const loadFavorites = async () => {
      // Verificar si hay token directamente
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const data = await favoritesService.getUserFavorites();
        console.log("Datos recibidos de favoritos:", data);

        // Adaptador: Transformar FavoriteDTO al formato esperado por Card
        const adaptedData = data.map((favorite) => ({
          idProduct: favorite.productId,
          name: favorite.productName,
          // Como no tenemos price en FavoriteDTO, podemos establecer un valor por defecto
          price: favorite.price || 0,
          // Adaptamos la URL de la imagen
          image: favorite.productImage,
        }));

        console.log("Datos adaptados:", adaptedData);
        setFavorites(adaptedData);
        setError(null);
      } catch (err) {
        console.error("Error al cargar favoritos:", err);

        // Si hay error de autorización, redirigir al inicio
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError(
          "No pudimos cargar tus favoritos. Por favor, intenta más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [navigate]);

  // Función para manejar la eliminación de un favorito
  const handleRemoveFavorite = async (productId) => {
    if (!productId) {
      console.error("No se puede eliminar: ID de producto inválido");
      return;
    }

    try {
      await favoritesService.removeFromFavorites(productId);
      // Actualizar la lista de favoritos sin necesidad de recargar
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.idProduct !== productId)
      );
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      setError("No se pudo eliminar el favorito. Intenta de nuevo más tarde.");
    }
  };

  // Función para ver detalle del producto
  const handleViewDetail = (productId) => {
    if (!productId) {
      console.error("No se puede navegar: ID de producto inválido");
      return;
    }
    navigate(`/product/${productId}`);
  };

  // Renderizado para estado de carga
  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#7a0715] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3d2130]">
            Mis Favoritos
          </h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-5 w-5" />
              inicio
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-[#7a0715] text-[#7a0715] p-4 mb-6 rounded-r-md">
            <p>{error}</p>
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="bg-gradient-to-b from-[#e6b465]/10 to-[#e6b465]/5 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] border border-[#e6b465]/20">
            <div className="mb-6 p-4 bg-white/80 rounded-full shadow-lg">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c78418"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-[#3d2130] mb-3">
              No tienes productos favoritos aún
            </h3>

            <p className="text-[#3d2130]/70 max-w-md mx-auto mb-8">
              Explora nuestro catálogo y marca como favoritos los instrumentos
              que te gusten para acceder rápidamente a ellos.
            </p>

            <Link to="/">
              <Button>Ver instrumentos</Button>
            </Link>
          </div>
        ) : (
          <section className="flex items-start justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 w-full max-w-3xl gap-x-20 gap-y-8">
              {favorites.map((product) => (
                <Card
                  key={product.idProduct}
                  product={product}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
