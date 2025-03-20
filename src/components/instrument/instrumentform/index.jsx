import PropTypes from "prop-types";
import { X } from "lucide-react";
import { useInstrumentForm } from "./useInstrumentForm";
import FormFields from "./FormFields";
import ImageUploader from "./ImageUploader";
import "../../../styles/Modal.css";

/**
 * InstrumentForm component - Handles creation and editing of instruments
 * 
 * Single Responsibility: Manages the overall form UI structure and orchestrates
 * the form submission process
 */
export const InstrumentForm = ({ isOpen, onClose, instrumentToEdit = null }) => {
  const {
    formData,
    categories,
    imagePreviews,
    isEditMode,
    handleInputChange,
    handleSubmit,
    handleImageUpload,
    removeImage,
    resetForm,
    handleClose
  } = useInstrumentForm({ isOpen, onClose, instrumentToEdit });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1e1e1e]/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#b08562] to-[#d9c6b0] p-4 rounded-t-xl flex justify-between items-center border-b border-[#d9c6b0] z-10">
          <h2 className="text-[#3e0b05] text-xl font-bold">
            {isEditMode ? "Editar Categoría del Instrumento" : "Registrar Instrumento"}
          </h2>
          <button
            onClick={handleClose}
            className="lex items-center justify-center rounded-full bg-white/20 text-[#3e0b05] hover:bg-white/40 transition-all"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form
          className="p-5 space-y-5 overflow-y-auto max-h-[calc(92vh-64px)]"
          onSubmit={handleSubmit}
        >
          <div className="bg-[#F9F7F4] p-5 rounded-xl">
            <FormFields 
              formData={formData}
              categories={categories}
              isEditMode={isEditMode}
              handleInputChange={handleInputChange}
            />
          </div>

          <div className="bg-[#F9F7F4] p-5 rounded-xl">
            <ImageUploader 
              isEditMode={isEditMode}
              imagePreviews={imagePreviews}
              removeImage={removeImage}
              handleImageUpload={handleImageUpload}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-[#d9c6b0]">
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
              {isEditMode ? "Actualizar Categoría" : "Registrar Instrumento"}
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

// Exportación dual para máxima compatibilidad
export default InstrumentForm;