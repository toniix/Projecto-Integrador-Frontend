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
        <div className="p-6 bg-[#e6d1bb] rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#5a0c04] mb-4 text-center">Lista de Instrumentos</h2>
            <di className="overflow-x-auto">
                <table className="w-full text-left border border-[#a37b63] rounded-lg shadow-md">
                    <thead className="bg-[#730f06] text-[#e6d1bb] uppercase">
                        <tr>
                            <th className="p-3 border-b border-[#a37b63]">Id</th>
                            <th className="p-3 border-b border-[#a37b63]">Nombre</th>
                            <th className="p-3 border-b border-[#a37b63]">Stock</th>
                            <th className="p-3 border-b border-[#a37b63] text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-[#5a0c04] bg-[#f1eae7]">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.idProduct} className="border-b border-[#a37b63] hover:bg-[#c6bcb049] transition">
                                    <td className="p-3">{product.idProduct}</td>
                                    <td className="p-3">{product.name}</td>
                                    <td className="p-3">{product.stock}</td>
                                    <td className="p-3 text-center">
                                        <button className="text-[#e6d1bb] bg-[#730f06] hover:bg-[#5a0c04] py-1 px-2 rounded mr-2 transition">
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsConfirmationModalOpen(true);
                                                setProductId(product.idProduct);
                                            }}
                                            className="text-[#e6d1bb] bg-[#b08562] hover:bg-[#5a0c04] py-1 px-2 rounded transition"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-[#5a0c04]">
                                    No hay productos disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </di>
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
