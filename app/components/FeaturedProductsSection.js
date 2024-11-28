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
  <div className="bg-white/95 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
    <h3 className="font-bold text-base md:text-lg text-gray-800 line-clamp-1 mb-1 md:mb-2">
      {product.name}
    </h3>
    <div className="flex justify-between items-center">
      <span className="text-xs md:text-sm text-gray-600 line-clamp-1">
        {product.description}
      </span>
      <span className="text-base md:text-lg font-bold text-red-600">
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
    <div className="relative w-full h-[300px] md:h-[350px] lg:h-[400px] p-4 md:p-6">
      <div className="relative w-full h-full flex items-center justify-center">
        <Link href={`/products/${product.id}`}>
          <div className="relative w-[200px] md:w-[225px] lg:w-[250px] h-[200px] md:h-[225px] lg:h-[250px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill={true}
              priority={isFirst}
              className="object-contain"
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
      <div className="absolute top-2 md:top-4 right-2 md:right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-700">
        <Link href={`/products/${product.id}`}>
          <button className="p-2 md:p-3 bg-white rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
            <Search className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </Link>
        <AddToCartButton2
          onClick={handleAddToCart}
          isLoading={isLoading}
          isAdded={isAdded}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
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
    <section className="py-12 md:py-16 lg:py-20 bg-gray-200 rounded-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0 mb-8 md:mb-12">
          <div>
            <h4 className="text-red-600 font-medium mb-1 md:mb-2">
              Lo Más Destacado
            </h4>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-['Roboto'] text-gray-700">
              Productos Destacados
            </h2>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <Link
              href="/products"
              className="flex items-center gap-2 text-red-600 hover:gap-4 transition-all text-sm md:text-base"
            >
              Ver Catálogo <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
