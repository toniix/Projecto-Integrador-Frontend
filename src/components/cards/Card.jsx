import React from "react";

const Card = ({ product, onViewDetail }) => {
  return (
    <div
      className="bg-white shadow-lg rounded-2xl p-6"
      onClick={() => onViewDetail(product.idProduct)}
    >
      <img
        src={product.imageUrls[0]}
        alt={product.name}
        className="w-full h-96 object-fill rounded-md "
      />
      <h3 className="mt-2 text-lg font-semibold text-[#1E1E1E]">{product.name}</h3>
      <p className="text-sm text-[#757575]">{product.description}</p>
    </div>
  );
};

export default Card;