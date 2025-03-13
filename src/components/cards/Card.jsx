import React from "react";
import Button from "../common/Button";

const Card = ({ product, onViewDetail }) => {
  return (
    <div
      className="cursor-pointer h-6/6 bg-white shadow-2xl rounded-3xl"
      onClick={() => onViewDetail(product.idProduct)}
    >
      <img
        src={`/provisorio/${product.idProduct}.jpg`}        alt={product.name}
        className="w-full h-60 object-cover rounded-t-2xl"
      />
       <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl text-[#1E1E1E]">{product.name}</h3>
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-2xl text-[#C78418]">{`$${product.price}`}</h2>
          <Button onClick={() => onViewDetail(product.idProduct)}>Ver</Button>
        </div>
        

      </div>
    </div>
  );
};

export default Card;