import { useState, useEffect } from 'react';
import instrumentService from '../../services/instrumentService';
import PaginationComponent from '../../components/common/PaginationComponent';
import '../../styles/ListProduct.css';

export const ListProduct = () => {
    const [products, setAllProducts] = useState([]); // Almacena los productos
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [totalPages] = useState(1); // Total de páginas
    // Tamaño de página fijo

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await instrumentService.getInstrumenAll(0, 10); // Inicia en 0
            console.log("Respuesta procesada:", data);
            setAllProducts(data.products);
        };

        fetchProducts();
    }, []);

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
                <tbody className='body-table'>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.idProduct} className='product-row'>
                                <td>{product.idProduct}</td>
                                <td>{product.name}</td>
                                <td>{product.stock}</td>
                                <td className="actions-column">
                                    <button className="edit-btn">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button className="delete-btn">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No hay productos disponibles</td>
                        </tr>
                    )}
                </tbody>


            </table>
            <PaginationComponent currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
    );
};
