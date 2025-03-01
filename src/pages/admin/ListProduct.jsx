import { useState, useEffect } from "react";
import instrumentService from "../../services/instrumentService";
import PaginationComponent from "../../components/common/PaginationComponent";
import "../../styles/ListProduct.css";
import { Trash2, Edit } from "lucide-react";
import { successToast, errorToast } from "../../utils/toastNotifications";
import ConfirmationModal from "../../components/instrument/ConfirmationModal";
import { InstrumentForm } from "../../components/instrument/InstrumentForm"; // Importamos el formulario

export const ListProduct = () => {
    const [products, setAllProducts] = useState([]); // Almacena los productos
    const [currentPage, setCurrentPage] = useState(1); // Página actual en UI (base 1)
    const [totalPages, setTotalPages] = useState(1); // Total de páginas
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [productId, setProductId] = useState(null);
    
    // Estados para el modal de edición
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedInstrument, setSelectedInstrument] = useState(null);

    const fetchProducts = async (uiPage) => {
        // Convertimos de UI (base 1) a API (base 0)
        const apiPage = uiPage - 1;
        
        console.log(`Solicitando página ${apiPage} a la API (página ${uiPage} en UI)`);
        
        const data = await instrumentService.getInstrumenAll(apiPage, 10);
        console.log("Respuesta procesada:", data);
        
        setAllProducts(data.products);
        setTotalPages(data.totalPages);
        
        // Si la API devuelve la página actual (en base 0), la convertimos a base 1 para la UI
        if (data.currentPageIndex !== undefined) {
            const uiPageFromApi = data.currentPageIndex + 1;
            console.log(`API devolvió página ${data.currentPageIndex} (base 0), que es página ${uiPageFromApi} en UI (base 1)`);
            
            // Solo actualizamos si es diferente para evitar loops
            if (uiPageFromApi !== currentPage) {
                setCurrentPage(uiPageFromApi);
            }
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]); // Se ejecuta cuando cambia la página

    // Función para eliminar un producto
    const handleDelete = (id) => {
        instrumentService
            .deleteInstrument(id)
            .then(() => {
                fetchProducts(currentPage);
                successToast("Instrumento eliminado correctamente");
                console.log("Instrumento eliminado correctamente");
            })
            .catch((error) => {
                console.error("Error al eliminar el instrumento:", error);
                errorToast("Error al eliminar el instrumento");
            });
    };

    // Función para abrir modal de edición
    const handleOpenEditModal = (product) => {
        // Preparamos los datos del producto para el formato esperado por el formulario
        const formattedProduct = {
            id: product.idProduct,
            name: product.name,
            brand: product.brand,
            model: product.model,
            year: product.year,
            stock: product.stock,
            description: product.description,
            price: product.price,
            available: product.available,
            idCategory: product.idCategory,
            imageUrls: product.imageUrls || []
        };
        
        setSelectedInstrument(formattedProduct);
        setIsEditModalOpen(true);
    };

    // Función para cerrar modal de edición
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedInstrument(null);
        // Refrescamos los productos después de cerrar el modal (en caso de ediciones)
        fetchProducts(currentPage);
    };

    return (
        <div className="p-6 bg-[#e6d1bb] rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#5a0c04] mb-4 text-center">Lista de Instrumentos</h2>
            <div className="overflow-x-auto">
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
                                    <td className="p-3 flex justify-center gap-2">
                                        {/* Botón de editar */}
                                        <button 
                                            onClick={() => handleOpenEditModal(product)}
                                            className="flex items-center justify-center text-[#730f06] bg-[#e6d1bb] hover:bg-[#d9c6b0] py-1 px-2 rounded transition w-10 h-10 border border-[#730f06]"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        
                                        {/* Botón de eliminar */}
                                        <button
                                            onClick={() => {
                                                setIsConfirmationModalOpen(true);
                                                setProductId(product.idProduct);
                                            }}
                                            className="flex items-center justify-center text-[#e6d1bb] bg-[#730f06] hover:bg-[#e6d1bb] hover:text-[#730f06] py-1 px-2 rounded transition w-10 h-10 border border-[#730f06]"
                                        >
                                            <Trash2 size={18} />
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
            </div>
            {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}
            
            {/* Modal de confirmación para eliminar */}
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onDelete={handleDelete}
                id={productId}
            />
            
            {/* Modal para editar instrumentos */}
            <InstrumentForm
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                instrumentToEdit={selectedInstrument}
            />
        </div>
    );
};

export default ListProduct;