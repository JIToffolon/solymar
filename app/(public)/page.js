"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Search,
  TrendingUp,
  ShieldCheck,
  Truck,
  RefreshCw,
  Loader,
  Users,
  Phone,
} from "lucide-react";
import { monserrat, roboto } from "../ui/fonts";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const PRODUCT_INTERVAL = 8000; // 8 segundos
  const navigationCards = [
    {
      title: "Productos",
      description: "Explora nuestra colección completa",
      icon: ShoppingBag,
      link: "/products",
      color: "from-red-600 to-red-700",
    },
    {
      title: "Sobre Nosotros",
      description: "Conoce nuestra historia",
      icon: Users,
      link: "/about",
      color: "from-red-700 to-red-800",
    },
    {
      title: "Contacto",
      description: "Estamos para ayudarte",
      icon: Phone,
      link: "/contacto",
      color: "from-red-800 to-red-900",
    },
  ];

  // Función para obtener los productos destacados
  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products/featured");
      if (!response.ok) {
        throw new Error("Error al cargar los productos");
      }
      const data = await response.json();
      setFeaturedProducts(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();

    // Auto rotate products solo si tenemos productos
    const productTimer = setInterval(() => {
      setActiveProductIndex(
        (prev) => (prev + 1) % (featuredProducts.length || 1)
      );
    }, PRODUCT_INTERVAL);

    return () => {
      clearInterval(productTimer);
    };
  }, [featuredProducts.length]);

  const nextProduct = () => {
    setActiveProductIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevProduct = () => {
    setActiveProductIndex(
      (prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length
    );
  };
  return (
    <div className="min-h-screen font-['Montserrat'] container mx-auto px-0 max-w-[100%]">
      <section className="relative h-[800px]  bg-gradient-to-r from-red-600 to-red-800 rounded-xl ">
        <div className="absolute inset-0 flex items-center w-full">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-12 gap-8 items-center">
              {/* Contenido principal del hero - 5 columnas */}
              <div className="col-span-5">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white"
                >
                  <h2 className="text-xl mb-4 font-['Roboto']">
                    Temporada 2024
                  </h2>
                  <h1 className="text-6xl font-bold mb-6">SOLYMAR</h1>
                  <p className="text-xl mb-8 opacity-90">
                    Descubrí las últimas tendencias
                  </p>
                  <button className="bg-white text-red-600 px-10 py-4 rounded-full font-medium hover:bg-gray-100 transition-all transform hover:scale-105">
                    Explorar Ahora
                  </button>
                </motion.div>
              </div>

              {/* Carrusel de productos - 7 columnas */}
              <div className="col-span-7">
                {loading ? (
                  <div className="h-[600px] bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin text-white" />
                  </div>
                ) : error ? (
                  <div className="h-[600px] bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="mb-4">{error}</p>
                      <button
                        onClick={fetchFeaturedProducts}
                        className="bg-white text-red-600 px-6 py-2 rounded-full"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Contenedor principal del carrusel */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                      <div className="relative h-[600px]">
                        <AnimatePresence mode="wait">
                          {featuredProducts.map((product, idx) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, x: 50 }}
                              animate={{
                                opacity: activeProductIndex === idx ? 1 : 0,
                                x: activeProductIndex === idx ? 0 : 50,
                              }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ duration: 0.5 }}
                              className={`absolute inset-0 ${
                                activeProductIndex === idx
                                  ? "pointer-events-auto"
                                  : "pointer-events-none"
                              }`}
                            >
                              <div className="bg-white rounded-xl h-[600px] shadow-xl overflow-hidden">
                                {/* Contenedor de la imagen */}
                                <div className="relative h-[75%]">
                                  <img
                                    src={
                                      product.imageUrl ||
                                      "/api/placeholder/800/1000"
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                  />
                                  {product.category && (
                                    <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                      {product.category}
                                    </div>
                                  )}
                                </div>

                                {/* Información del producto */}
                                <div className="h-[25%] p-8 flex flex-col justify-between">
                                  <h3 className="text-2xl font-bold text-gray-800">
                                    {product.name}
                                  </h3>
                                  <div className="flex justify-between items-center">
                                    <span className="text-3xl font-bold text-red-600">
                                      ${Number(product.price).toFixed(2)}
                                    </span>
                                    <button className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors transform hover:scale-105">
                                      <ShoppingBag size={24} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* Controles del carrusel */}
                      {featuredProducts.length > 1 && (
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
                          <button
                            onClick={prevProduct}
                            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                          >
                            <ArrowLeft className="w-6 h-6 text-white" />
                          </button>
                          <div className="flex gap-3">
                            {featuredProducts.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setActiveProductIndex(idx)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                  activeProductIndex === idx
                                    ? "bg-white"
                                    : "bg-white/50"
                                }`}
                              />
                            ))}
                          </div>
                          <button
                            onClick={nextProduct}
                            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                          >
                            <ArrowRight className="w-6 h-6 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features con diseño minimalista y animado */}
      <section className="py-20 bg-white text-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Envío Express",
                desc: "Entregas en 24-48hs",
              },
              {
                icon: ShieldCheck,
                title: "Compra Segura",
                desc: "100% Garantizado",
              },
              {
                icon: RefreshCw,
                title: "Cambios Gratis",
                desc: "30 días de prueba",
              },
              {
                icon: TrendingUp,
                title: "Mejores Precios",
                desc: "Garantía de precio",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl hover:bg-gray-50 transition-colors text-center flex flex-col items-center  justify-center"
              >
                <div className="w-12 h-12 bg-red-100 rounded-xl flex  items-center  justify-center mb-6 group-hover:bg-red-600 transition-colors">
                  <feature.icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold mb-2 font-['Roboto']">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Productos Destacados con diseño de grid dinámico */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h4 className="text-red-600 font-medium mb-2">
                Lo Más Destacado
              </h4>
              <h2 className="text-4xl font-bold font-['Roboto'] text-gray-700">
                Productos Destacados
              </h2>
            </div>
            <div className="flex items-center gap-8">
              <button className="flex items-center gap-2 text-red-600 hover:gap-4 transition-all">
                Ver Catálogo <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: product * 0.1 }}
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Contenedor principal con altura fija */}
              <div className="relative h-[400px] w-full">
                {" "}
                {/* Altura fija para todas las cards */}
                {/* Contenedor de la imagen */}
                <div className="relative h-full w-full">
                  <img
                    src={`${product.imageUrl}`}
                    alt={`${product.name}`}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Botones flotantes */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-700">
                    <button className="p-3 bg-white rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Search className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Overlay con información */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="font-bold text-lg text-gray-800 line-clamp-1 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 line-clamp-1">
                          {product.description}
                        </span>
                        <span className="text-lg font-bold text-red-600">
                          $ {product.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 relative -mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            {navigationCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative h-[400px] rounded-2xl shadow-xl overflow-hidden group cursor-pointer"
              >
                <Link href={card.link}>
                  {/* Fondo con gradiente */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Contenido central */}
                  <div className="relative h-full p-8 flex flex-col items-center justify-center text-white">
                    <card.icon className="w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-500" />
                    <h3 className="text-3xl font-bold mb-4 text-center">
                      {card.title}
                    </h3>
                    <p className="text-lg text-center mb-8 opacity-90">
                      {card.description}
                    </p>

                    {/* Botón con efecto hover */}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-full font-medium group-hover:bg-opacity-100 transition-all"
                    >
                      <span>Explorar</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>

                  {/* Overlay decorativo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Patrón decorativo (opcional) */}
                  <div className="absolute inset-0 opacity-20 bg-pattern mix-blend-soft-light" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
