import React from "react";
import { getIconForFeature } from "./featureIcons"; // Importa la función correcta
import { CheckCircle } from "lucide-react";
import "./ProductFeatures.css";

const ProductFeatures = ({ features }) => {
  return (
    <div className="product-features-container">
      <p className="text-2xl mb-4">Características</p>
      {features && features.length > 0 ? (
        <div className="product-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="product-feature-item">
              <span>
                {getIconForFeature(feature) || (
                  <CheckCircle className="w-6 h-6" />
                )}
              </span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No hay características disponibles.</p>
      )}
    </div>
  );
};

export default ProductFeatures;
