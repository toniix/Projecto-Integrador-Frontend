import { useState, useEffect } from "react";
import instrumentService from "../../services/instrumentService";
import PaginationComponent from "../../components/common/PaginationComponent";
import "../../styles/ListProduct.css";
import { Trash2, Edit, Eye, Plus, RefreshCw, Package, Filter, SortDesc, Download, X, Check, ChevronDown, ChevronUp, Search } from "lucide-react";
import { successToast, errorToast } from "../../utils/toastNotifications";
import ConfirmationModal from "../../components/instrument/ConfirmationModal";
import { InstrumentForm } from "../../components/instrument/InstrumentForm"; 
import Button from "../../components/common/Button";

export const ListProduct = () => {
    const [products, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(1); 
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [productId, setProductId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    
    // Estados para modales
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedInstrument, setSelectedInstrument] = useState(null);
    
    // Estados para filtrado y ordenamiento
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [filterStock, setFilterStock] = useState("all"); // "all", "available", "low", "out"
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "ascending"
    });
    
    // Calcular el número de productos disponibles, stock bajo y agotados
    const availableCount = products.filter(p => p.stock > 10).length;
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    const fetchProducts = async (uiPage) => {
        setIsLoading(true);
        try {
            const apiPage = uiPage - 1;
            const data = await instrumentService.getInstrumenAll(apiPage, 10);
            
            setAllProducts(data.products || []);
            setFilteredProducts(data.products || []);
            setTotalPages(data.totalPages || 1);
            setLastUpdate(new Date());
            
            if (data.currentPageIndex !== undefined) {
                const uiPageFromApi = data.currentPageIndex + 1;
                if (uiPageFromApi !== currentPage) {
                    setCurrentPage(uiPageFromApi);
                }
            }
        } catch (error) {
            console.error("Error al cargar productos:", error);
            errorToast("No se pudieron cargar los instrumentos");
            setAllProducts([]);
            setFilteredProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para aplicar filtros a los productos
    const applyFilters = () => {
        let result = [...products];
        
        // Aplicar filtro de texto (nombre, marca o modelo)
        if (filterText) {
            const searchTerm = filterText.toLowerCase();
            result = result.filter(product => 
                product.name.toLowerCase().includes(searchTerm) || 
                (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
                (product.model && product.model.toLowerCase().includes(searchTerm))
            );
        }
        
        // Aplicar filtro de stock
        if (filterStock !== "all") {
            switch (filterStock) {
                case "available":
                    result = result.filter(product => product.stock > 10);
                    break;
                case "low":
                    result = result.filter(product => product.stock > 0 && product.stock <= 10);
                    break;
                case "out":
                    result = result.filter(product => product.stock === 0);
                    break;
                default:
                    break;
            }
        }
        
        // Aplicar ordenamiento
        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        
        setFilteredProducts(result);
    };

    // Función para cambiar el ordenamiento
    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    // Efecto para cargar productos iniciales
    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);
    
    // Efecto para aplicar filtros cuando cambian
    useEffect(() => {
        applyFilters();
    }, [filterText, filterStock, sortConfig, products]);

    // Función para eliminar un producto
    const handleDelete = (id) => {
        instrumentService
            .deleteInstrument(id)
            .then(() => {
                fetchProducts(currentPage);
                successToast("Instrumento eliminado correctamente");
            })
            .catch((error) => {
                console.error("Error al eliminar el instrumento:", error);
                errorToast("Error al eliminar el instrumento");
            });
    };

    // Función para abrir modal de edición
    const handleOpenEditModal = (product) => {
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

    // Función para cerrar modales
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedInstrument(null);
        fetchProducts(currentPage);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        fetchProducts(currentPage);
    };
    
    // Función para limpiar filtros
    const clearFilters = () => {
        setFilterText("");
        setFilterStock("all");
        setSortConfig({ key: "name", direction: "ascending" });
    };
    
    // Renderizar icono de ordenamiento
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ChevronDown size={14} className="opacity-40" />;
        }
        return sortConfig.direction === "ascending" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    return (
        <div className="bg-[#F9F7F4] rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-6 bg-gradient-to-r from-[#d9c6b0] to-[#F9F7F4]">
                {/* Encabezado con título y estadísticas */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#3e0b05] mb-2">Catálogo de Instrumentos</h2>
                        <p className="text-[#757575]">
                            {products.length} instrumentos en total
                            <span className="text-xs ml-3">
                                Última actualización: {lastUpdate.toLocaleTimeString()}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            onClick={() => fetchProducts(currentPage)}
                            disabled={isLoading}
                        >
                            <div className="flex items-center gap-2">
                                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                                <span>{isLoading ? "Cargando..." : "Actualizar"}</span>
                            </div>
                        </Button>
                        <Button 
                            variant="primary"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <div className="flex items-center gap-2">
                                <Plus size={16} />
                                <span>Nuevo Instrumento</span>
                            </div>
                        </Button>
                    </div>
                </div>
                
                {/* Panel de filtros y ordenamiento */}
                <div className="mb-6 p-4 bg-[#3B0012]/10 rounded-lg border border-[#3B0012]/20">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-[#3e0b05]">Opciones de búsqueda</h3>
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="text-[#3e0b05] hover:text-[#730f06] text-sm flex items-center gap-1"
                        >
                            {isFilterOpen ? "Ocultar filtros" : "Mostrar filtros"}
                            {isFilterOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    </div>
                    
                    {/* Resumen de filtros aplicados */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        <div className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center">
                            <span className="mr-1">{availableCount}</span> disponibles
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 flex items-center">
                            <span className="mr-1">{lowStockCount}</span> stock bajo
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center">
                            <span className="mr-1">{outOfStockCount}</span> agotados
                        </div>
                        
                        {(filterText || filterStock !== "all" || sortConfig.key !== "name") && (
                            <button 
                                onClick={clearFilters}
                                className="px-3 py-1 rounded-full text-xs bg-[#d9c6b0] text-[#3e0b05] flex items-center gap-1 hover:bg-[#b08562] hover:text-white transition-colors"
                            >
                                <X size={12} />
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                    
                    {/* Formulario de filtros */}
                    {isFilterOpen && (
                        <div className="mt-4 pt-4 border-t border-[#3B0012]/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-[#3e0b05] mb-1">Buscar por nombre o marca</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={filterText}
                                        onChange={(e) => setFilterText(e.target.value)}
                                        placeholder="Buscar..." 
                                        className="pl-9 pr-3 py-2 rounded-lg border border-[#d9c6b0] bg-white w-full focus:outline-none focus:border-[#3e0b05] transition-colors"
                                    />
                                    <Search size={16} className="absolute left-3 top-3 text-[#757575]" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm text-[#3e0b05] mb-1">Filtrar por stock</label>
                                <select 
                                    value={filterStock}
                                    onChange={(e) => setFilterStock(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-[#d9c6b0] bg-white w-full focus:outline-none focus:border-[#3e0b05] transition-colors"
                                >
                                    <option value="all">Todos los instrumentos</option>
                                    <option value="available">Disponibles ({">"} 10)</option>
                                    <option value="low">Stock bajo (1-10)</option>
                                    <option value="out">Agotados (0)</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm text-[#3e0b05] mb-1">Ordenar por</label>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => requestSort("name")}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors ${
                                            sortConfig.key === "name" 
                                            ? "bg-[#b08562] text-white" 
                                            : "bg-white border border-[#d9c6b0] text-[#3e0b05] hover:bg-[#d9c6b0]"
                                        }`}
                                    >
                                        Nombre {sortConfig.key === "name" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                                    </button>
                                    <button 
                                        onClick={() => requestSort("price")}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors ${
                                            sortConfig.key === "price" 
                                            ? "bg-[#b08562] text-white" 
                                            : "bg-white border border-[#d9c6b0] text-[#3e0b05] hover:bg-[#d9c6b0]"
                                        }`}
                                    >
                                        Precio {sortConfig.key === "price" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                                    </button>
                                    <button 
                                        onClick={() => requestSort("stock")}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors ${
                                            sortConfig.key === "stock" 
                                            ? "bg-[#b08562] text-white" 
                                            : "bg-white border border-[#d9c6b0] text-[#3e0b05] hover:bg-[#d9c6b0]"
                                        }`}
                                    >
                                        Stock {sortConfig.key === "stock" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Tabla de instrumentos */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#d9c6b0] transition-all duration-300 hover:shadow-lg">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center p-12 space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#730f06]"></div>
                            <p className="text-[#757575]">Cargando productos...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-[#3B0012] text-white">
                                <tr>
                                    <th className="p-4 font-medium">ID</th>
                                    <th className="p-4 font-medium">Imagen</th>
                                    <th className="p-4 font-medium">
                                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => requestSort("name")}>
                                            Nombre {getSortIcon("name")}
                                        </div>
                                    </th>
                                    <th className="p-4 font-medium">Marca</th>
                                    <th className="p-4 font-medium">
                                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => requestSort("stock")}>
                                            Stock {getSortIcon("stock")}
                                        </div>
                                    </th>
                                    <th className="p-4 font-medium">
                                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => requestSort("price")}>
                                            Precio {getSortIcon("price")}
                                        </div>
                                    </th>
                                    <th className="p-4 font-medium text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#d9c6b0]">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product.idProduct} className="hover:bg-[#F9F7F4] transition-colors duration-300">
                                            <td className="p-4 text-[#1e1e1e] font-mono">{product.idProduct}</td>
                                            <td className="p-4">
                                                {product.imageUrls && product.imageUrls.length > 0 ? (
                                                    <div className="h-16 w-16 rounded-xl overflow-hidden bg-[#d9c6b0] shadow-sm">
                                                        <img 
                                                            src={product.imageUrls[0]} 
                                                            alt={product.name}
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-16 w-16 rounded-xl bg-[#d9c6b0] flex items-center justify-center text-[#3e0b05]">
                                                        <Package size={24} />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 font-medium text-[#3e0b05]">{product.name}</td>
                                            <td className="p-4 text-[#757575]">{product.brand}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    product.stock > 10 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : product.stock > 0 
                                                            ? 'bg-yellow-100 text-yellow-800' 
                                                            : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {product.stock} unidades
                                                </span>
                                            </td>
                                            <td className="p-4 font-medium text-[#1e1e1e]">
                                                ${typeof product.price === 'number' ? product.price.toLocaleString('es-AR') : product.price}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center gap-2">
                                                    <Button 
                                                        variant="secondary"
                                                        onClick={() => handleOpenEditModal(product)}
                                                        className="p-2 h-auto"
                                                        title="Editar"
                                                    >
                                                        <Edit size={18} />
                                                    </Button>
                                                    
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => {
                                                            setIsConfirmationModalOpen(true);
                                                            setProductId(product.idProduct);
                                                        }}
                                                        className="p-2 h-auto"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                    
                                                    <Button 
                                                        variant="outline"
                                                        className="p-2 h-auto"
                                                        title="Ver detalles"
                                                    >
                                                        <Eye size={18} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-12 text-center text-[#757575]">
                                            <div className="flex flex-col items-center gap-4">
                                                <Package size={48} className="text-[#b08562] mb-2" />
                                                {filterText || filterStock !== "all" ? (
                                                    <>
                                                        <p className="text-lg">No se encontraron instrumentos con los filtros aplicados</p>
                                                        <Button 
                                                            variant="secondary" 
                                                            onClick={clearFilters}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <X size={18} />
                                                                <span>Limpiar filtros</span>
                                                            </div>
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-lg">No hay instrumentos disponibles</p>
                                                        <Button 
                                                            variant="primary" 
                                                            onClick={() => setIsCreateModalOpen(true)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Plus size={18} />
                                                                <span>Agregar uno ahora</span>
                                                            </div>
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                
                {/* Paginación */}
                {!isLoading && filteredProducts.length > 0 && totalPages > 1 && (
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
                id={productId}
            />
            
            {/* Modal para editar instrumentos */}
            <InstrumentForm
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                instrumentToEdit={selectedInstrument}
            />
            
            {/* Modal para crear instrumentos */}
            <InstrumentForm
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
            />
        </div>
    );
};

export default ListProduct;