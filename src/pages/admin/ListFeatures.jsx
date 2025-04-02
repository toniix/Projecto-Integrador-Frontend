import React, { useState, useEffect } from "react";
import featureService from "../../services/featureService";
import PaginationComponent from "../../components/common/PaginationComponent";
import "../../styles/ListProduct.css";
import { Trash2, Edit, ShieldCheck, RefreshCw, Plus, Package } from "lucide-react";
import { successToast, errorToast } from "../../utils/toastNotifications";
import ConfirmationModal from "../../components/instrument/ConfirmationModal";
import Button from "../../components/common/Button";
import FeatureForm from "../../components/ProductFeatures/FeatureForms";
import * as lucideIcons from "lucide-react";

export const ListFeatures = () => {
    const [features, setAllfeatures] = useState([]);



    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [featureId, setFeatureId] = useState(null);
    const [featureName, setFeatureName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    // Obtener caracteristicas paginados
    const fetchfeatures = async (uiPage) => {
        setIsLoading(true);
        try {

            const apiPage = uiPage - 1;
            console.log(`Solicitando página ${apiPage} a la API`);
            const token = localStorage.getItem("token");
            const data = await featureService.getFeatureAll(apiPage, 10, token);
            console.log("Respuesta procesada:", data);

            setAllfeatures(data.features);
            setTotalPages(data.totalPages);

            if (data.currentPageIndex !== undefined) {
                const uiPageFromApi = data.currentPageIndex + 1;
                if (uiPageFromApi !== currentPage) {
                    setCurrentPage(uiPageFromApi);
                }
            }
        } catch (error) {
            console.error("Error al cargar caracteristicas:", error);
            errorToast("No se pudieron cargar las caracteristicas");
            setAllfeatures([]);
        } finally {
            setIsLoading(false);
        }
    };




    useEffect(() => {
        fetchfeatures(currentPage);
    }, [currentPage]);

    // Obtener detalle del usuario por ID antes de abrir el modal
    const fetchfeatureDetails = async (featureId) => {
        console.log(`Obteniendo detalles del usuario con ID: ${featureId}`);
        const token = localStorage.getItem("token");
        try {
            const featureDetails = await featuresService.getfeatureById(featureId, token);
            console.log("Detalles del usuario recibidos:", featureDetails);
            setSelectedRoles(featureDetails.response.roles); // Guardamos el detalle del usuario
            setfeatureId(featureId);
            setIsAssignRolesOpen(true);
        } catch (error) {
            console.error("Error al obtener detalles del usuario:", error);
            errorToast("No se pudo obtener la información del usuario.");
        }
    };





    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        fetchfeatures(currentPage);
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem("token");
        featureService
            .deleteFeature(id, token)
            .then(() => {
                fetchfeatures(currentPage);
                successToast("Caracteristicas eliminada correctamente");
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
                    <h2 className="text-2xl font-bold text-[#3e0b05] mb-4">Caracteristicas</h2>
                    <p className="text-[#1e1e1e] mb-4">Todos las Caracteristicas</p>
                    <Button
                        variant="primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <div className="flex items-center gap-2">
                            <Plus size={16} />
                            <span>Nueva Caracteristica</span>
                        </div>
                    </Button>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#3e0b05] text-white">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-4 font-medium">Icono</th>
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
                                ) : (features.length > 0 ? (
                                    features.map((feature) => (
                                        <tr key={feature.idFeature} className="hover:bg-[#f1eae7] transition-colors">
                                            <td className="p-3 text-[#1e1e1e]">{feature.idFeature}</td>
                                            <td className="p-4">
                                                {feature.iconUrl ? (
                                                    <div className="h-12 w-12 flex items-center justify-center rounded-lg overflow-hidden bg-[#000000] shadow-md">
                                                    {React.createElement(lucideIcons[feature.iconUrl], { size: 20 , color: "#fff"})}
                                                  </div>
                                                ) : (
                                                    <div className="h-12 w-12 flex items-center justify-center rounded-lg overflow-hidden bg-[#101010] shadow-md">
                                                        <Package size={20} />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3 font-medium text-[#3e0b05]">{feature.name}</td>
                                            <td className="p-3 font-medium text-[#3e0b05]">{feature.description}</td>
                                            <td className="p-3">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        className="flex items-center justify-center text-white bg-[#730f06] hover:bg-[#3e0b05] p-2 rounded-md transition-colors"
                                                        title="Eliminar"
                                                        onClick={() => {
                                                            setIsConfirmationModalOpen(true);
                                                            setFeatureId(feature.idFeature);
                                                            setFeatureName(feature.name);
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
                id={featureId}
                name={featureName}
            />
            {/* Modal para crear instrumentos */}
            <FeatureForm
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
            />

        </div>
    );
};

export default ListFeatures;
