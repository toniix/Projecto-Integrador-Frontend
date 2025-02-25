import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import { InstrumentContext } from "../../context/InstrumentContext";
import instrumentService from "../../services/instrumentService";
import cloudinaryService from "../../services/images/cloudinaryService";
import { successToast, errorToast } from "../../utils/toastNotifications";

import { X, Plus, Trash2 } from "lucide-react";

export const InstrumentForm = ({ isOpen, onClose }) => {
  const { addInstrument } = useContext(InstrumentContext);

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
        setToastMessage("Error al cargar categorías");
        setCategories([]); // Asegura que `categories` siempre sea un array
      }
    };

    fetchCategories();
  }, []);

  console.log(categories);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "idCategory"
          ? Number(value)
          : value,
    }));
  };

  // Manejo de imágenes
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files && images.length < 5) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.idCategory) {
        errorToast("Debes seleccionar una categoría.");
        return;
      }

      const urls = await Promise.all(
        images.map((image) => cloudinaryService.uploadImage(image)) // Subir las imágenes al servidor
      );

      const newInstrument = await instrumentService.createInstrument({
        ...formData,
        imageUrls: urls,
      });
      addInstrument(newInstrument);
      resetForm();
      successToast("Instrumento agregado con éxito.");

      onClose();
    } catch (error) {
      if (error.response?.status === 409) {
        console.log("Error detectado:", error);

        errorToast("El instrumento ya existe. Intenta con otro nombre.");
      } else if (error.response?.status === 400) {
        errorToast("Datos inválidos. Revisa el formulario.");
      } else if (error.response?.status === 500) {
        errorToast("Error en el servidor. Inténtalo más tarde.");
      } else {
        errorToast("Error al crear el instrumento.");
      }
    }

    const resetForm = () => {
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
    };
  };

  return (
    <div className="fixed inset-0 bg-[#1e1e1e]/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1e1e1e] p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">
            Registrar Instrumento
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#d9c6b0] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#1e1e1e] font-medium mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#757575] rounded-lg focus:outline-none focus:border-[#b08562]"
              />
            </div>

            <div>
              <label className="block text-[#1e1e1e] font-medium mb-2">
                Marca
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#757575] rounded-lg focus:outline-none focus:border-[#b08562]"
              />
            </div>

            <div>
              <label className="block text-[#1e1e1e] font-medium mb-2">
                Modelo
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#757575] rounded-lg focus:outline-none focus:border-[#b08562]"
              />
            </div>

            <div>
              <label className="block text-[#1e1e1e] font-medium mb-2">
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
                className="w-full px-4 py-2 border border-[#757575] rounded-lg focus:outline-none focus:border-[#b08562]"
              />
            </div>

            <div>
              <label className="block text-[#1e1e1e] font-medium mb-2">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#757575] rounded-lg focus:outline-none focus:border-[#b08562]"
              />
            </div>

            <div>
              <label className="block text-[#1e1e1e] font-medium mb-2">
                Categoría
              </label>
              <select
                name="category"
                value={formData.idCategory}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#757575] rounded-lg focus:outline-none focus:border-[#b08562]"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#1e1e1e] font-medium mb-2">
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
                className="w-full px-4 py-2 border border-[#757575] rounded-lg focus:outline-none focus:border-[#b08562]"
              />
            </div>

            <div>
              <label className="block text-[#1e1e1e] font-medium mb-2">
                Disponible
              </label>
              <select
                name="available"
                value={formData.available}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-[#757575] rounded-lg focus:outline-none focus:border-[#b08562]"
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#1e1e1e] font-medium mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-[#757575] rounded-lg focus:outline-none focus:border-[#b08562]"
            ></textarea>
          </div>

          <div>
            <label className="block text-[#1e1e1e] font-medium mb-2">
              Imágenes (máximo 5)
            </label>
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={image}
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
                {images.length < 5 && (
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
              onClick={onClose}
              className="px-6 py-2 border border-[#757575] rounded-lg text-[#1e1e1e] hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#730f06] text-white rounded-lg hover:bg-[#b08562] transition-colors"
            >
              Registrar
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
};
