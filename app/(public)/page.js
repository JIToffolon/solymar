"use client";
import React from "react";
import { Suspense, useState, useEffect,useCallback } from "react";
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

  const fetchFeaturedProducts = useCallback(async () => {
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
  },[featuredProducts.length]);

  // Efecto para cargar productos
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

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
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<Loader />}>
        {/* Hero Section - Full width */}
        <section className="w-full">
          <HeroSection
            featuredProducts={featuredProducts}
            activeIndex={activeProductIndex}
            onNext={nextProduct}
            onPrev={prevProduct}
            loading={loading}
            error={error}
            onRetry={fetchFeaturedProducts}
          />
        </section>

        {/* Features Section - Contenido centrado */}
        <section className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <FeaturesSection />
          </div>
        </section>

        {/* Featured Products Section - Contenido centrado */}
        <section className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <FeaturedProductsSection products={featuredProducts} />
          </div>
        </section>

        {/* Navigation Section - Contenido centrado */}
        <section className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <NavigationSection />
          </div>
        </section>
      </Suspense>
    </div>
  );
}
