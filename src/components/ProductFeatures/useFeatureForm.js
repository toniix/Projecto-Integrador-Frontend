import { useState, useEffect, useCallback } from "react";

import { successToast, errorToast } from "../../utils/toastNotifications";
import featureService from "../../services/featureService";
import cloudinaryService from "../../services/images/cloudinaryService";

/**
 * Custom hook to manage instrument form state and logic
 * 
 * Follows Single Responsibility Principle: Handles only form state management
 * and form submission logic, separate from UI rendering
 */
export const useFeatureForm = ({ isOpen, onClose, initialData }) => {
  
  const isEditMode = !!initialData;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    iconName: "",
  });

  
  
  // Image state
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Form reset - Using useCallback to memoize the function
  const resetForm = useCallback(() => {
    // Clean up any object URLs to prevent memory leaks
    imagePreviews.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    setFormData({
      name: "",
      description: "",
      imageUrl: "",
    });

    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
  }, [imagePreviews]); // Only depend on imagePreviews


 
  // Handle modal state changes
  useEffect(() => {
    // When modal closes, we'll clean up object URLs
    if (!isOpen) {
      // Cleanup function for blob URLs
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    }
  }, [isOpen, imagePreviews]);

  // This is a separate effect just for resetting the form when opening in non-edit mode
  // IMPORTANT: Removed the call to resetForm inside the effect body to prevent infinite loop
  useEffect(() => {
    if (isOpen && !isEditMode) {
      // Initialize empty form when opening in create mode
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
      });
      
      setImageFiles([]);
      setImagePreviews([]);
      setExistingImages([]);
    }
  }, [isOpen, isEditMode]);

  // Form input handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

   
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "idFeature"
          ? Number(value)
          : name === "available"
          ? value === "true"
          : value,
    }));
  };

  


  const handleClose = () => {
    onClose();
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      

      
        // Verify images in creation mode
        if (imageFiles.length === 0) {
          errorToast("Debes agregar al menos una imagen.");
          return;
        }
        const token = localStorage.getItem("token");
        

        // Create instrument with image URLs
        const newFeature = await featureService.createFeature({
          ...formData,
          imageUrl:imageUrl[0],
        },token);

        
        
        successToast("Categoria agregado con éxito.");
      
      
      handleClose();
    } catch (error) {
      console.error("Error completo:", error);

      if (error.response?.status === 409) {
        errorToast("El Categoria ya existe. Intenta con otro nombre.");
      } else if (error.response?.status === 400) {
        errorToast("Datos inválidos. Revisa el formulario.");
      } else if (error.response?.status === 500) {
        errorToast("Error en el servidor. Inténtalo más tarde.");
      } else {
        errorToast(error.message || `Error al ${isEditMode ? 'actualizar la categoría' : 'crear'} el Categoria.`);
      }
    }
  };

  return {
    formData,
    isEditMode,
    handleInputChange,
    handleSubmit,
    resetForm,
    handleClose
  };
};