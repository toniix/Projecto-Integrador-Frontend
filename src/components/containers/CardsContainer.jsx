import React from "react";
import Card from "../cards/Card";
const CardsContainer = ({ products, handleViewDetail }) => {
    return (
      <section className="flex items-center justify-center min-h-screen p-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2  w-full max-w-4xl gap-20">
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