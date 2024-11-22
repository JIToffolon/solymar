// components/FeaturedProductsSection.jsx
"use client";
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton2 from "./addToCartButton2";
import AddedToCartNotification from "./AddedToCartNotification";

const ProductInfo = React.memo(({ product }) => (
  <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
    <h3 className="font-bold text-lg text-gray-800 line-clamp-1 mb-2">
      {product.name}
    </h3>
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600 line-clamp-1">
        {product.description}
      </span>
      <span className="text-lg font-bold text-red-600">
        ${Number(product.price).toFixed(2)}
      </span>
    </div>
  </div>
));

const ProductCard = React.memo(({ product, isFirst = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
  >
    {/* Contenedor principal con altura fija */}
    <div className="relative w-full h-[400px] p-6">
      {" "}
      {/* Padding uniforme */}
      {/* Contenedor de la imagen con tamaño fijo y centrado */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Link href={`/products/${product.id}`}>
          <div className="relative w-[250px] h-[250px]">
            {" "}
            {/* Tamaño fijo para todas las imágenes */}
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill={true} // Usar fill en lugar de width/height
              priority={isFirst}
              className="object-contain" // Mantener proporción y centrar
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      </div>
      <ProductOverlay product={product} />
    </div>
  </motion.div>
));

const ProductOverlay = React.memo(({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Error al agregar al carrito");
      }

      setIsAdded(true);
      setShowNotification(true);
      
      setTimeout(() => {
        setIsAdded(false);
        setShowNotification(false);
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-700">
        <Link href={`/products/${product.id}`}>
          <button className="p-3 bg-white rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </Link>
        <AddToCartButton2
          onClick={handleAddToCart}
          isLoading={isLoading}
          isAdded={isAdded}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <ProductInfo product={product} />
      </div>
      <AddedToCartNotification 
        isVisible={showNotification} 
        productName={product.name}
      />
    </>
  );
});

const FeaturedProductsSection = ({ products }) => {
  return (
    <section className="py-20 bg-gray-200 rounded-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h4 className="text-red-600 font-medium mb-2">Lo Más Destacado</h4>
            <h2 className="text-4xl font-bold font-['Roboto'] text-gray-700">
              Productos Destacados
            </h2>
          </div>
          <div className="flex items-center gap-8">
            <Link
              href="/products"
              className="flex items-center gap-2 text-red-600 hover:gap-4 transition-all"
            >
              Ver Catálogo <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
