import PropTypes from "prop-types";
import { Plus, Trash2 } from "lucide-react";

/**
 * ImageUploader component - Handles image preview and uploading UI
 *
 * Customizable for single or multiple images.
 */
const ImageUploader = ({
  isEditMode,
  imagePreviews,
  removeImage,
  handleImageUpload,
  maxImages = 5,
  isSingle = false,
  gridCols = 5,
}) => {
  return (
    <div>
      <label className="block text-[#3e0b05] font-medium mb-2">
        {isSingle ? "Imagen" : `Imágenes (máximo ${maxImages})`}
      </label>
      <div className="space-y-4">
        <div className={`grid ${isSingle ? "grid-cols-1 place-items-center" : `grid-cols-${gridCols}`} gap-4`}>
          {imagePreviews.map((preview, index) => (
            <div
              key={index}
              className={`relative group aspect-square ${
                isSingle ? "w-24 h-24" : "w-full"
              }`}
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              {!isEditMode && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-[#b08562] rounded-full text-white hover:bg-[#3e0b05] transition-all shadow-md"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          {!isEditMode && imagePreviews.length < maxImages && (
            <label
              className={`aspect-square flex items-center justify-center border-2 border-[#757575] border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${
                isSingle ? "w-24 h-24" : ""
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                <Plus className="text-[#b08562] mb-1" size={24} />
                <span className="text-xs text-[#757575]">Añadir</span>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple={!isSingle}
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

ImageUploader.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  imagePreviews: PropTypes.array.isRequired,
  removeImage: PropTypes.func.isRequired,
  handleImageUpload: PropTypes.func.isRequired,
  maxImages: PropTypes.number,
  isSingle: PropTypes.bool,
  gridCols: PropTypes.number,
};

export default ImageUploader;
