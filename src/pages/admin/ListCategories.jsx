import { useState, useEffect } from "react";
import categoryService from "../../services/categoryService";
import PaginationComponent from "../../components/common/PaginationComponent";
import "../../styles/ListProduct.css";
import { Trash2, Edit, ShieldCheck, RefreshCw, Plus, Package } from "lucide-react";
import { successToast, errorToast } from "../../utils/toastNotifications";
import ConfirmationModal from "../../components/instrument/ConfirmationModal";
import Button from "../../components/common/Button";
import CategoryForm from "../../components/category/CategoryForm";


export const ListCategories = () => {
    const [categories, setAllcategories] = useState([]);



    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [categoryName, setCategoryName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    // Obtener categorias paginados
    const fetchcategorys = async (uiPage) => {
        setIsLoading(true);
        try {

            const apiPage = uiPage - 1;
            console.log(`Solicitando página ${apiPage} a la API`);
            const token = localStorage.getItem("token");
            const data = await categoryService.getCategoryAll(apiPage, 10, token);
            console.log("Respuesta procesada:", data);

            setAllcategories(data.categories);
            setTotalPages(data.totalPages);

            if (data.currentPageIndex !== undefined) {
                const uiPageFromApi = data.currentPageIndex + 1;
                if (uiPageFromApi !== currentPage) {
                    setCurrentPage(uiPageFromApi);
                }
            }
        } catch (error) {
            console.error("Error al cargar categorias:", error);
            errorToast("No se pudieron cargar las categorias");
            setAllcategories([]);
        } finally {
            setIsLoading(false);
        }
    };




    useEffect(() => {
        fetchcategorys(currentPage);
    }, [currentPage]);

    // Obtener detalle del usuario por ID antes de abrir el modal
    const fetchcategoryDetails = async (categoryId) => {
        console.log(`Obteniendo detalles del usuario con ID: ${categoryId}`);
        const token = localStorage.getItem("token");
        try {
            const categoryDetails = await categorysService.getcategoryById(categoryId, token);
            console.log("Detalles del usuario recibidos:", categoryDetails);
            setSelectedRoles(categoryDetails.response.roles); // Guardamos el detalle del usuario
            setcategoryId(categoryId);
            setIsAssignRolesOpen(true);
        } catch (error) {
            console.error("Error al obtener detalles del usuario:", error);
            errorToast("No se pudo obtener la información del usuario.");
        }
    };





    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        fetchcategorys(currentPage);
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem("token");
        categoryService
            .deleteCategory(id, token)
            .then(() => {
                fetchcategorys(currentPage);
                successToast("Categoria eliminada correctamente");
            })
            .catch((error) => {
                console.error("Error al eliminar la categoria:", error);
                errorToast("Error al eliminar  la categoria");
            });
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#d9c6b0] to-[#f1eae7]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-[#3e0b05] mb-4">Categorias</h2>
                    <p className="text-[#1e1e1e] mb-4">Todos las Categorias</p>
                    <Button
                        variant="primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <div className="flex items-center gap-2">
                            <Plus size={16} />
                            <span>Nueva Categoria</span>
                        </div>
                    </Button>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#3e0b05] text-white">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-4 font-medium">Imagen</th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Descripcion</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d9c6b0]">

                            {
                                isLoading ? (
                                    <tr>
                                        <td colSpan="4" className="p-12 text-center">
                                            <div className="flex flex-col justify-center items-center space-y-4">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#730f06]"></div>
                                                <p className="text-[#757575]">Cargando Categorías...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (categories.length > 0 ? (
                                    categories.map((category) => (
                                        <tr key={category.idCategory} className="hover:bg-[#f1eae7] transition-colors">
                                            <td className="p-3 text-[#1e1e1e]">{category.idCategory}</td>
                                            <td className="p-4">
                                                {category.imageUrl ? (
                                                    <div className="h-16 w-16 rounded-xl overflow-hidden bg-[#d9c6b0] shadow-sm">
                                                        <img 
                                                            src={category.imageUrl} 
                                                            alt={category.name}
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-16 w-16 rounded-xl bg-[#d9c6b0] flex items-center justify-center text-[#3e0b05]">
                                                        <Package size={24} />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3 font-medium text-[#3e0b05]">{category.name}</td>
                                            <td className="p-3 font-medium text-[#3e0b05]">{category.description}</td>
                                            <td className="p-3">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        className="flex items-center justify-center text-white bg-[#730f06] hover:bg-[#3e0b05] p-2 rounded-md transition-colors"
                                                        title="Eliminar"
                                                        onClick={() => {
                                                            setIsConfirmationModalOpen(true);
                                                            setCategoryId(category.idCategory);
                                                            setCategoryName(category.name);
                                                        }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>


                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-6 text-center text-[#757575]">
                                            No hay usuarios disponibles
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                )}
            </div>
            {/* Modal de confirmación para eliminar */}
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onDelete={handleDelete}
                id={categoryId}
                name={categoryName}
            />
            {/* Modal para crear instrumentos */}
            <CategoryForm
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
            />

        </div>
    );
};

export default ListCategories;
