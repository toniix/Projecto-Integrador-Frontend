import { useState, useEffect } from "react";
import instrumentService from "../../services/instrumentService";
import PaginationComponent from "../../components/common/PaginationComponent";
import "../../styles/ListProduct.css";
import { Trash2 } from "lucide-react";
import { successToast, errorToast } from "../../utils/toastNotifications";
import ConfirmationModal from "../../components/instrument/ConfirmationModal";

export const ListProduct = () => {
  const [products, setAllProducts] = useState([]); // Almacena los productos
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages] = useState(1); // Total de páginas
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [productId, setProductId] = useState(null);

  const fetchProducts = async () => {
    const data = await instrumentService.getInstrumenAll(0, 10); // Inicia en 0
    console.log("Respuesta procesada:", data);
    setAllProducts(data.products);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  console.log(products);

  // Función para eliminar un producto
  const handleDelete = (id) => {
    instrumentService
      .deleteInstrument(id)
      .then(() => {
        fetchProducts();
        successToast("Instrumento eliminado correctamente");
        console.log("Instrumento eliminado correctamente");
      })
      .catch((error) => {
        console.error("Error al eliminar el instrumento:", error);
        errorToast("Error al eliminar el instrumento");
      });
  };

  return (
    <div className="product-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="body-table">
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.idProduct} className="product-row">
                <td>{product.idProduct}</td>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td className="actions-column">
                  <button className="edit-btn">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    onClick={() => {
                      setIsConfirmationModalOpen(true);
                      setProductId(product.idProduct);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hay productos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onDelete={handleDelete}
        id={productId}
      />
    </div>
  );
};

export default ListProduct;
