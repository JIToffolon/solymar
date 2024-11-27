"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Share2,
  Check,
  ChevronRight,
  ArrowLeft,
  Truck,
  Shield,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const ProductDetail = ({ product }) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const feature = [
    { icon: Truck, text: "Envío gratis" },
    { icon: Shield, text: "Garantía de calidad" },
    { icon: RefreshCw, text: "30 días para cambios" },
  ];
  // Array de imágenes del producto (ajustar según tu estructura de datos)
  const productImages = [product.imageUrl].filter(Boolean);
  //Para el Futuro con más imagenes.
  // const productImages = [
  //   product.imageUrl,
  //   product.image2,
  //   product.image3,
  //   // ... más imágenes
  // ].filter(Boolean);

  const handleAddToCart = async () => {
    try {
      // Validación de stock
      if (product.stock === 0) {
        toast.error("Producto sin stock disponible");
        return;
      }

      if (quantity > product.stock) {
        toast.error(`Solo hay ${product.stock} unidades disponibles`);
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (data.error === "Stock insuficiente") {
          toast.error(`Solo hay ${data.availableStock} unidades disponibles`);
          return;
        }
        throw new Error(data.error || "Error al agregar al carrito");
      }

      setAddedToCart(true);
      toast.success("¡Producto agregado al carrito!");
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product.stock || 10)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-['Montserrat'] text-gray-700">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center text-sm text-gray-500">
          <button
            onClick={() => router.back()}
            className="flex items-center hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Galería de Imágenes */}
          <div>
            <div className="relative aspect-[3/4] mb-4 bg-white rounded-2xl overflow-hidden">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain cursor-zoom-in"
                onClick={() => setShowZoom(true)}
              />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-red-600"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`Vista ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del Producto */}
          <div>
            <div className="sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <div className="text-sm text-gray-600">
                    {product.category}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 rounded-full hover:bg-gray-100 transition-colors">
                    <Heart className="w-6 h-6 text-gray-600" />
                  </button>
                  <button className="p-3 rounded-full hover:bg-gray-100 transition-colors">
                    <Share2 className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold text-red-600">
                  ${product.price}
                </span>
              </div>

              <div className="mb-8">
                <h3 className="font-medium mb-4">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mb-8">
                {/* Indicador de Stock */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Stock disponible
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock <= 5
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {product.stock === 0
                        ? "Sin stock"
                        : `${product.stock} unidad${
                            product.stock !== 1 ? "es" : ""
                          }`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        product.stock === 0
                          ? "bg-gray-400"
                          : product.stock <= 5
                          ? "bg-red-500"
                          : product.stock <= 10
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min((product.stock / 100) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {product.stock > 0 ? (
                  <div className="flex gap-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                      <button
                        onClick={decrementQuantity}
                        className={`p-3 transition-colors ${
                          quantity <= 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "hover:text-red-600"
                        }`}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="w-12 text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className={`p-3 transition-colors ${
                          quantity >= product.stock
                            ? "text-gray-300 cursor-not-allowed"
                            : "hover:text-red-600"
                        }`}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      disabled={loading || product.stock === 0}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-lg font-medium
                ${
                  loading || product.stock === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : addedToCart
                    ? "bg-green-600"
                    : "bg-red-600 hover:bg-red-700"
                } text-white transition-colors`}
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      ) : addedToCart ? (
                        <>
                          <Check className="w-5 h-5" />
                          Agregado al carrito
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          Agregar al carrito
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-600 font-medium">
                      Producto sin stock disponible
                    </span>
                  </div>
                )}

                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              {/* Características Adicionales */}
              <div className="grid grid-cols-3 gap-4 mb-8 cursor-pointer">
                {feature.map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-4 bg-white rounded-xl"
                  >
                    <feature.icon className="w-6 h-6 text-red-600 mb-2" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Zoom */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setShowZoom(false)}
          >
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
