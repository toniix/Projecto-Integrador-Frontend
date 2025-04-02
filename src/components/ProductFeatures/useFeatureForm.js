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
    iconUrl: "",
  });

  
  
  // Image state
 
  const [icon, setIcon] = useState("");

  // Form reset - Using useCallback to memoize the function
  const resetForm = useCallback(() => {
    // Clean up any object URLs to prevent memory leaks
   

    setFormData({
      name: "",
      description: "",
      iconUrl: "",
    });

    setIcon("");
  }, []); // Only depend on imagePreviews


 
 

  // This is a separate effect just for resetting the form when opening in non-edit mode
  // IMPORTANT: Removed the call to resetForm inside the effect body to prevent infinite loop
  useEffect(() => {
    if (isOpen && !isEditMode) {
      // Initialize empty form when opening in create mode
      setFormData({
        name: "",
        description: "",
        iconUrl: "",
      });
      setIcon("");
      
    }
  }, [isOpen, isEditMode]);

  // Form input handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

   
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIconName = (iconName) =>{
    setIcon(iconName)
  }

  const handleClose = () => {
    onClose();
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      

      
        // Verify images in creation mode
        if (icon === "") {
          errorToast("Debes seleccionar un icono.");
          return;
        }
        const token = localStorage.getItem("token");
        

        // Create instrument with image URLs
        const newFeature = await featureService.createFeature({
          ...formData,
          iconUrl:icon,
        },token);

        
        
        successToast("Caracteristica agregada con éxito.");
      
      
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
    handleIconName,
    handleInputChange,
    handleSubmit,
    resetForm,
    handleClose
  };
};