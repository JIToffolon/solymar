"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductDetail from "@/app/components/ProductDetail";

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        console.log("Producto cargado:", data);
        setProduct(data);
      } catch (err) {
        console.error("Error al cargar el producto:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">Producto no encontrado</p>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}