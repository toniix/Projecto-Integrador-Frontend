import React from "react";
import { Info, Shield, Truck, UserCheck, RotateCcw, Wrench } from "lucide-react";
import "./ProductPolicies.css";

const ProductPolicies = ({ policies }) => {
  // Función para obtener el ícono adecuado según el nombre de la política
  const getIconForPolicy = (policy) => {
    const policyName = policy.nombre.toLowerCase();
    
    if (policyName.includes("cuidado") || policyName.includes("mantenimiento")) {
      return <Info className="w-6 h-6" />;
    } else if (policyName.includes("uso") || policyName.includes("adecuado")) {
      return <Shield className="w-6 h-6" />;
    } else if (policyName.includes("almacenamiento") || policyName.includes("transporte")) {
      return <Truck className="w-6 h-6" />;
    } else if (policyName.includes("responsabilidad") || policyName.includes("usuario")) {
      return <UserCheck className="w-6 h-6" />;
    } else if (policyName.includes("reparación") || policyName.includes("daños")) {
      return <Wrench className="w-6 h-6" />;
    } else if (policyName.includes("devolución") || policyName.includes("condiciones")) {
      return <RotateCcw className="w-6 h-6" />;
    }
    
    // Ícono por defecto
    return <Info className="w-6 h-6" />;
  };

  return (
    <div className="product-policies-container">
      <p className="text-2xl mb-4">Políticas de Uso</p>
      {policies && policies.length > 0 ? (
        <div className="product-policies-list">
          {policies.map((policy, index) => (
            <div key={index} className="product-policy-item">
              <div className="policy-header">
                <span className="policy-icon">{getIconForPolicy(policy)}</span>
                <h3 className="policy-title">{policy.nombre}</h3>
              </div>
              <p className="policy-description">{policy.descripcion}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No hay políticas disponibles para este producto.</p>
      )}
    </div>
  );
};

export default ProductPolicies;