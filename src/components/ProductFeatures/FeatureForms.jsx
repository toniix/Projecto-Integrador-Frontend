import PropTypes from "prop-types";
import { useFeatureForm } from "./useFeatureForm";
import { X } from "lucide-react";
import IconSelector from "./IconSelector";
import { useState } from "react";
const FeatureForm = ({ isOpen, onClose, initialData  }) => {
    
    
   const {
      formData,
      isEditMode,
      handleIconName,
      handleInputChange,
      handleSubmit,
      resetForm,
      handleClose
    } = useFeatureForm({ isOpen, onClose, initialData });
  
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-[#1e1e1e]/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-3xl overflow-hidden shadow-xl">
            {/* Encabezado */}
            <div className="sticky top-0 bg-gradient-to-r from-[#b08562] to-[#d9c6b0] p-4 rounded-t-xl flex justify-between items-center border-b border-[#d9c6b0] z-10">
              <h2 className="text-[#3e0b05] text-xl font-bold">
                {isEditMode ? "Editar Caracteríastica del Instrumento" : "Registrar Caracteríastica"}
              </h2>
              <button
                onClick={handleClose}
                className="flex items-center justify-center rounded-full bg-white/20 text-[#3e0b05] hover:bg-white/40 transition-all p-2"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
      
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              <FormField
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isEditMode}
              />
      
              <FormField
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                disabled={isEditMode}
              />
      
              {/* Sección de iconos */}
              <div className="bg-[#F9F7F4] p-1 rounded-xl">
                <IconSelector onSelect={handleIconName}/>
              </div>
      
              {/* Botones */}
              <div className="flex justify-center md:justify-end space-x-4 pt-4 border-t border-[#d9c6b0] bg-white p-4 rounded-b-xl">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-[#d9c6b0] text-[#3e0b05] rounded-lg hover:bg-[#F9F7F4] transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3e0b05] text-white rounded-lg hover:bg-[#730f06] transition-all shadow-sm"
                >
                  {isEditMode ? "Actualizar Característica" : "Registrar Característica"}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
      
};

const FormField = ({ label, name, value, onChange, required, disabled }) => {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full p-2 border rounded ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
    </div>
  );
};

FeatureForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  initialData: PropTypes.object
};



export default FeatureForm;
