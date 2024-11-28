"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import AddToCartButton2 from "./addToCartButton2";
import AddedToCartNotification from "./AddedToCartNotification";
import CategoryNav from "./CategoryNav";

const ProductInfo = React.memo(({ product }) => {
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
      <div className="h-[25%] p-2 md:p-8 flex flex-col justify-between">
        <h3 className="text-lg md:text-2xl font-bold text-gray-800">
          {product.name}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-lg md:text-3xl font-bold text-red-600">
            ${Number(product.price).toFixed(2)}
          </span>
          <AddToCartButton2
            onClick={handleAddToCart}
            isLoading={isLoading}
            isAdded={isAdded}
            className="transform hover:scale-105"
          />
        </div>
      </div>
      <AddedToCartNotification
        isVisible={showNotification}
        productName={product.name}
      />
    </>
  );
});
const HeroContent = React.memo(() => (
  <div className="w-full lg:col-span-5">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-white text-center lg:text-left"
    >
      <h2 className="text-lg md:text-xl mb-2 md:mb-4 font-['Roboto']">
        Temporada 2024
      </h2>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
        SOLYMAR
      </h1>
      <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
        Descubrí las últimas tendencias
      </p>
      <Link href={"/products"}>
        <button className="bg-white text-red-600 px-6 md:px-10 py-3 md:py-4 rounded-full font-medium hover:bg-gray-100 transition-all transform hover:scale-105">
          Explorar Ahora
        </button>
      </Link>
    </motion.div>
  </div>
));

const ProductCarousel = React.memo(
  ({ products, activeIndex, onNext, onPrev }) => (
    <div className="w-full lg:col-span-7 lg:mt-0">
      <div className="relative ">
        <div className="bg-white/10 h-[430px] md:h-[550px] lg:h-[650px] backdrop-blur-md rounded-xl p-4 md:p-6">
          <div className="relative h-[300px] md:h-[500px] lg:h-[600px]">
            <AnimatePresence mode="sync">
              {products.map(
                (product, idx) =>
                  activeIndex === idx && (
                    <CarouselItem key={product.id} product={product} />
                  )
              )}
            </AnimatePresence>
          </div>
          <CarouselControls
            length={products.length}
            activeIndex={activeIndex}
            onNext={onNext}
            onPrev={onPrev}
          />
        </div>
      </div>
    </div>
  )
);

const CarouselItem = React.memo(({ product }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.5 }}
    className="absolute inset-0 cursor-pointer"
  >
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-xl h-[400px] md:h-[500px] lg:h-[600px] shadow-xl overflow-hidden">
        <div className="relative h-[75%]">
          <Image
            src={product.imageUrl || "/api/placeholder/800/1000"}
            alt={product.name}
            width={800}
            height={1000}
            priority={true}
            className="w-full h-full object-contain"
          />
          {product.category && (
            <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-red-600 text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium">
              {product.category}
            </div>
          )}
        </div>
        <ProductInfo product={product} />
      </div>
    </Link>
  </motion.div>
));

const CarouselControls = ({ length, activeIndex, onNext, onPrev }) => (
  <div className="absolute -bottom-12 md:-bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-4 md:gap-6">
    <button
      onClick={onPrev}
      className="p-2 md:p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
    >
      <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
    </button>
    <div className="flex gap-2 md:gap-3">
      {Array.from({ length }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => setActiveProductIndex(idx)}
          className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
            activeIndex === idx ? "bg-white" : "bg-white/50"
          }`}
        />
      ))}
    </div>
    <button
      onClick={onNext}
      className="p-2 md:p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
    >
      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
    </button>
  </div>
);

const HeroSection = ({
  featuredProducts,
  activeIndex,
  onNext,
  onPrev,
  loading,
  error,
  onRetry,
}) => {
  return (
    <section className="relative min-h-[800px] md:h-[950px] lg:h-[1000px] mt-10 mx-5 bg-gradient-to-r from-red-500 to-red-800 rounded-xl p-4 md:p-6 lg:p-8">
      <div className="absolute inset-0 flex items-center w-full">
      <CategoryNav/>
        <div className="container mx-auto px-4 ">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 items-center">
            <HeroContent />
            {loading ? (
              <div className="w-full lg:col-span-7 h-[400px] md:h-[500px] lg:h-[600px] bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : error ? (
              <div className="w-full lg:col-span-7 h-[400px] md:h-[500px] lg:h-[600px] bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="mb-4">{error}</p>
                  <button
                    onClick={onRetry}
                    className="bg-white text-red-600 px-4 md:px-6 py-2 rounded-full text-sm md:text-base"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            ) : (
              <ProductCarousel
                products={featuredProducts}
                activeIndex={activeIndex}
                onNext={onNext}
                onPrev={onPrev}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
