import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import { InstrumentContext } from "../../context/InstrumentContext";
import instrumentService from "../../services/instrumentService";
import cloudinaryService from "../../services/images/cloudinaryService";
import { successToast, errorToast } from "../../utils/toastNotifications";
import { X, Plus, Trash2 } from "lucide-react";
import "../../styles/Modal.css";

export const InstrumentForm = ({ isOpen, onClose, instrumentToEdit = null }) => {
  const { addInstrument, updateInstrument } = useContext(InstrumentContext);
  const isEditMode = !!instrumentToEdit;

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    stock: "",
    description: "",
    price: "",
    available: false,
    idCategory: "",
    imageUrls: [],
  });

  const [categories, setCategories] = useState([]);

  // Estado para manejar imágenes
  const [imageFiles, setImageFiles] = useState([]); // Para almacenar los archivos originales
  const [imagePreviews, setImagePreviews] = useState([]);
  // Para almacenar las URLs de vista previa
  const [existingImages, setExistingImages] = useState([]); // Para imágenes ya existentes en modo edición

  // Función para obtener las categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await instrumentService.getCategories();

        // Acceder al array dentro del objeto response
        if (
          data?.response?.categories &&
          Array.isArray(data.response.categories)
        ) {
          setCategories(data.response.categories);
        } else {
          console.error("La API no devolvió un array:", data);
          setCategories([]); // Evita que el valor sea null o undefined
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setCategories([]); // Asegura que categories siempre sea un array
      }
    };

    fetchCategories();
  }, []);

  // Cargar datos del instrumento a editar cuando estamos en modo edición
  useEffect(() => {
    if (isEditMode && instrumentToEdit) {
      setFormData({
        id: instrumentToEdit.id || instrumentToEdit.idInstrument,
        name: instrumentToEdit.name || "",
        brand: instrumentToEdit.brand || "",
        model: instrumentToEdit.model || "",
        year: instrumentToEdit.year || "",
        stock: instrumentToEdit.stock || "",
        description: instrumentToEdit.description || "",
        price: instrumentToEdit.price || "",
        available: instrumentToEdit.available || false,
        idCategory: instrumentToEdit.idCategory || "",
        imageUrls: [],
      });

      // Cargar imágenes existentes
      if (instrumentToEdit.imageUrls && instrumentToEdit.imageUrls.length > 0) {
        setExistingImages(instrumentToEdit.imageUrls);
        setImagePreviews(instrumentToEdit.imageUrls);
      }
    }
  }, [isEditMode, instrumentToEdit]);

  // Limpiar el formulario cuando se cierra y resetear cuando se abre de nuevo
  useEffect(() => {
    if (!isOpen) {
      // Al cerrar el modal, limpiamos las URLs de objetos
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    } else if (!isEditMode) {
      // Solo reseteamos si no estamos en modo edición
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "idCategory"
          ? Number(value)
          : name === "available"
          ? value === "true"
          : value,
    }));
  };

  // Manejo de imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const totalImages = imageFiles.length + existingImages.length;

    if (files.length && totalImages < 5) {
      // Limitar a 5 imágenes en total (nuevas + existentes)
      const newFiles = files.slice(0, 5 - totalImages);

      // Crear URLs de vista previa para las nuevas imágenes
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      // Actualizar los estados
      setImageFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    // Determinar si la imagen es existente o nueva
    const isExistingImage = index < existingImages.length;
    
    if (isExistingImage) {
      // Eliminar una imagen existente
      const imageUrl = existingImages[index];
      setExistingImages(existingImages.filter((_, i) => i !== index));
      setImagePreviews(imagePreviews.filter((url) => url !== imageUrl));
    } else {
      // Eliminar una nueva imagen
      const newIndex = index - existingImages.length;
      
      // Revocar la URL de objeto para evitar fugas de memoria
      if (imagePreviews[index] && imagePreviews[index].startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviews[index]);
      }

      setImageFiles((prev) => prev.filter((_, i) => i !== newIndex));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    // Limpiar todas las URLs de objetos
    imagePreviews.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    setFormData({
      name: "",
      brand: "",
      model: "",
      year: "",
      stock: "",
      description: "",
      price: "",
      available: false,
      idCategory: "",
      imageUrls: [],
    });

    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
  };

  // Función personalizada para cerrar el modal y limpiar el formulario
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.idCategory) {
        errorToast("Debes seleccionar una categoría.");
        return;
      }

      // Verificar que hay imágenes para subir (nuevas o existentes)
      if (imageFiles.length === 0 && existingImages.length === 0) {
        errorToast("Debes agregar al menos una imagen.");
        return;
      }

      // Subir nuevos archivos de imagen a Cloudinary (si hay)
      let allImageUrls = [...existingImages];
      
      if (imageFiles.length > 0) {
        const newUrls = await Promise.all(
          imageFiles.map((file) => cloudinaryService.uploadImage(file))
        );
        allImageUrls = [...allImageUrls, ...newUrls];
      }

      if (isEditMode) {
        // Actualizar el instrumento
        const updatedInstrument = await instrumentService.updateInstrument({
          ...formData,
          imageUrls: allImageUrls,
        });

        updateInstrument(updatedInstrument);
        successToast("Instrumento actualizado con éxito.");
      } else {
        // Crear el instrumento con las URLs de las imágenes
        const newInstrument = await instrumentService.createInstrument({
          ...formData,
          imageUrls: allImageUrls,
        });

        addInstrument(newInstrument);
        successToast("Instrumento agregado con éxito.");
      }
      
      handleClose();
    } catch (error) {
      console.error("Error completo:", error);

      if (error.response?.status === 409) {
        errorToast("El instrumento ya existe. Intenta con otro nombre.");
      } else if (error.response?.status === 400) {
        errorToast("Datos inválidos. Revisa el formulario.");
      } else if (error.response?.status === 500) {
        errorToast("Error en el servidor. Inténtalo más tarde.");
      } else {
        errorToast(error.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el instrumento.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1e1e1e]/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#b08562] p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-[#730f06] text-xl font-semibold">
            {isEditMode ? "Editar Instrumento" : "Registrar Instrumento"}
          </h2>
          <button
            onClick={handleClose}
            className="text-[#730f06] hover:text-[#d9c6b0] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form className="p-6 space-y-6 verflow-y-auto max-h-[500px] scrollbar-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#730f06] font-medium mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="select-category"
              />
            </div>

            <div>
              <label className="block text-[#730f06] font-medium mb-2">
                Marca
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                className="select-category"
              />
            </div>

            <div>
              <label className="block text-[#730f06] font-medium mb-2">
                Modelo
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                className="select-category"
              />
            </div>

            <div>
              <label className="block text-[#730f06] font-medium mb-2">
                Año
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear()}
                required
                className="select-category"
              />
            </div>

            <div>
              <label className="block text-[#730f06] font-medium mb-2">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="select-category"
              />
            </div>

            <div>
              <label className="block text-[#730f06] font-medium mb-2">
                Categoría
              </label>
              <select
                name="idCategory"
                value={formData.idCategory}
                onChange={handleInputChange}
                required
                className=" select-category "
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option
                    key={category.idCategory || category.id}
                    value={category.idCategory}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#730f06] font-medium mb-2">
                Precio
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                className="select-category"
              />
            </div>

            <div>
              <label className="block text-[#730f06] font-medium mb-2">
                Disponible
              </label>
              <select
                name="available"
                value={formData.available.toString()}
                onChange={handleInputChange}
                required
                className="select-category"
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#730f06] font-medium mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="select-category"
            ></textarea>
          </div>

          <div>
            <label className="block text-[#3e0b05] font-medium mb-2">
              Imágenes (máximo 5)
            </label>
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {imagePreviews.length < 5 && (
                  <label className="aspect-square flex items-center justify-center border-2 border-[#757575] border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center">
                      <Plus className="text-[#b08562] mb-1" size={24} />
                      <span className="text-xs text-[#757575]">Añadir</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border-2 border-[#730f06] text-[#730f06] rounded-lg text-[#1e1e1e] hover:text-[#d9c6b0] hover:bg-[#730f06]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#730f06] text-[#d9c6b0] rounded-lg hover:bg-[#b08562] transition-colors"
            >
              {isEditMode ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

InstrumentForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  instrumentToEdit: PropTypes.object,
};