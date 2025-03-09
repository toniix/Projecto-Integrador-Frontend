import React from "react";
import { Tag, Bolt, Ruler, AudioLines, Box, KeyboardMusic } from "lucide-react";

// Función para obtener el ícono según el prefijo del texto
export const getIconForFeature = (feature) => {
  const lowerFeature = feature.toLowerCase();
  if (lowerFeature.startsWith("marca:")) return <Tag className="w-6 h-6" />;
  if (lowerFeature.startsWith("tipo:")) return <Bolt className="w-6 h-6" />;
  if (lowerFeature.startsWith("tamaño:")) return <Ruler className="w-6 h-6" />;
  if (lowerFeature.startsWith("material:")) return <Box className="w-6 h-6" />;
  if (lowerFeature.startsWith("mecanismo:"))
    return <AudioLines className="w-6 h-6" />;
  if (lowerFeature.startsWith("producto:"))
    return <KeyboardMusic className="w-6 h-6" />;
  return null;
};
