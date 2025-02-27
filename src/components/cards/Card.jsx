import React from "react";

const Card = ({ product, onViewDetail }) => {
  return (
    <div
      className="cursor-pointer bg-white  w-full sm:w-1/2 max-w-md"
      onClick={() => onViewDetail(product.idProduct)}
    >
      <img
        src={product.imageUrls[0]}
        alt={product.name}
        className="w-full h-96 object-fill rounded-md "
      />
      <h3 className="mt-2 text-lg font-semibold text-[#730f06]">{product.name}</h3>
      <p className="text-sm text-[#757575]">{product.description}</p>
    </div>
  );
};

export default Card;