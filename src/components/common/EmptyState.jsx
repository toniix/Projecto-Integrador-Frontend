// src/components/common/EmptyState.jsx

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Heart, Search, AlertCircle, Info } from "lucide-react";

/**
 * Componente para mostrar estados vacíos con un mensaje amigable y una posible acción
 */
function EmptyState({ icon, title, description, actionText, actionLink }) {
    // Función para renderizar el icono según el tipo
    const renderIcon = () => {
        const iconSize = 48;
        const iconColor = "#c78418";

        switch (icon) {
            case "heart":
                return <Heart size={iconSize} className="text-[#c78418]" />;
            case "search":
                return <Search size={iconSize} className="text-[#c78418]" />;
            case "alert":
                return <AlertCircle size={iconSize} className="text-[#c78418]" />;
            default:
                return <Info size={iconSize} className="text-[#c78418]" />;
        }
    };

    return (
        <div className="bg-gradient-to-b from-[#e6b465]/10 to-[#e6b465]/5 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] border border-[#e6b465]/20">
            <div className="mb-6 p-4 bg-white/80 rounded-full shadow-lg">
                {renderIcon()}
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-[#3d2130] mb-3">
                {title}
            </h3>

            {description && (
                <p className="text-[#3d2130]/70 max-w-md mx-auto mb-8">
                    {description}
                </p>
            )}

            {actionText && actionLink && (
                <Link
                    to={actionLink}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#7a0715] to-[#3b0012] text-white 
            shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                    {actionText}
                </Link>
            )}
        </div>
    );
}

EmptyState.propTypes = {
    icon: PropTypes.oneOf(["heart", "search", "alert", "info"]),
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    actionText: PropTypes.string,
    actionLink: PropTypes.string,
};

EmptyState.defaultProps = {
    icon: "info",
    description: "",
    actionText: "",
    actionLink: "/",
};

export default EmptyState;