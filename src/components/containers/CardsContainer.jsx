import React from "react";
import Card from "../cards/Card";
const CardsContainer = ({ products, handleViewDetail }) => {
    return (
      <section className="p-20 bg-[#f1eae7] pt-5">
        <div className="flex flex-wrap justify-center gap-6">
          {products.map((prod) => (
            <Card
              key={prod.idProduct}
              product={prod}
              onViewDetail={handleViewDetail}
            />
          ))}
        </div>
      </section>
    );
  };

export default CardsContainer;