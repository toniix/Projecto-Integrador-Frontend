/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageGalleryPreview from "../components/imagegalery/ImageGalleryPreview";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://clavecompas-production.up.railway.app/clavecompas/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data.response))
      .catch((error) =>
        console.error("Error al obtener el detalle del product:", error)
      );
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail-container">
      <header className="product-detail-header">
        <h1 className="product-title">{product.name}</h1>
        <button className="back-button" onClick={() => navigate(-1)}>
          &#8592;
        </button>
      </header>
      <div className="product-detail-body">
        <p className="product-description">{product.description}</p>

        {/* Aquí se integra la galería de imágenes */}
        <ImageGalleryPreview
          productId={product.idProduct}
          imagenPrincipal={product.imageUrls[0]}
          galeria={product.imageUrls}
        />
        <p>{product.price}</p>
        <p>{product.stock}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
