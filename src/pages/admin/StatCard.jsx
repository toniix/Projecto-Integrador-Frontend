// Tarjeta para la página de inicio
const StatCard = ({ title, value, icon, color }) => {
  const Icon = icon;

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 border-l-4 hover:translate-y-[-5px] stat-card"
      style={{ borderLeftColor: color }}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[#757575] text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-[#1e1e1e]">{value}</h3>
        </div>
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={24} color={color} />
        </div>
      </div>
    </div>
  );
};
export default StatCard;
