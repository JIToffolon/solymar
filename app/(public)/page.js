"use client";
import React from "react";
import { Suspense, useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { cacheService } from "../utils/cache";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import FeaturedProductsSection from "../components/FeaturedProductsSection";
import NavigationSection from "../components/NavigationSection";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const PRODUCT_INTERVAL = 8000; // 8 segundos

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);

      // Intenta obtener datos del cache
      const cachedData = await cacheService.get("/api/products/featured");
      if (cachedData) {
        setFeaturedProducts(cachedData);
        setLoading(false);
      }

      // Obtiene datos frescos
      const response = await fetch("/api/products/featured");
      if (!response.ok) throw new Error("Error al cargar los productos");
      const freshData = await response.json();

      // Actualiza cache y estado
      await cacheService.set("/api/products/featured", freshData);
      setFeaturedProducts(freshData);
    } catch (err) {
      // Si hay datos en caché, no muestra error
      if (!featuredProducts.length) {
        setError(err.message);
      }
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar productos
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  // Efecto para el carrusel automático
  useEffect(() => {
    if (!featuredProducts.length) return;

    const productTimer = setInterval(() => {
      setActiveProductIndex((prev) => (prev + 1) % featuredProducts.length);
    }, PRODUCT_INTERVAL);

    return () => clearInterval(productTimer);
  }, [featuredProducts.length]);

  const nextProduct = () => {
    setActiveProductIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevProduct = () => {
    setActiveProductIndex(
      (prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length
    );
  };

  if (loading && !featuredProducts.length) return <Loader />;
  if (error && !featuredProducts.length) return <div>Error: {error}</div>;

  return (
    <>
      <div className="min-h-screen font-['Montserrat'] container mx-auto px-0 max-w-[100%]">
        <Suspense fallback={<Loader />}>
          <HeroSection
            featuredProducts={featuredProducts}
            activeIndex={activeProductIndex}
            onNext={nextProduct}
            onPrev={prevProduct}
            loading={loading}
            error={error}
            onRetry={fetchFeaturedProducts}
          />
          <FeaturesSection />
          <FeaturedProductsSection products={featuredProducts} />
          <NavigationSection />
        </Suspense>
      </div>
    </>
  );
}
