import AddToCartButton from "./addToCartButton";
import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };
  return (
    <div
      className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col p-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor de imagen con tamaño fijo */}
      <Link href={`/products/${product.id}`}>
        <div className="relative h-[200px] sm:h-[250px] md:h-[300px]">
          <div className="absolute inset-0 bg-gray-100">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Overlay con efecto hover */}
          <div
            className={`
            absolute inset-0 bg-gradient-to-t from-black/50 to-transparent
            transition-opacity duration-300
            ${isHovered ? "opacity-100" : "opacity-0"}
          `}
          />
        </div>
      </Link>
      <span className="text-sm md:text-base text-gray-700 text-center font-semibold mt-2">
              {product.name}
      </span>

      {/* Precio y controles */}
      <div className="pt-3 md:pt-4 border-t border-gray-100 mt-3 md:mt-4">
        <div className="flex items-center justify-between mb-3 md:mb-4 gap-2 md:gap-3">
          <div className="flex flex-col ">
            {product.originalPrice && (
              <span className="text-xs md:text-sm text-gray-500 line-through">
                ${Number(product.originalPrice).toFixed(2)}
              </span>
            )}
            <span className="text-lg md:text-xl font-bold text-red-600">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          {/* Controles de cantidad */}
          {product.stock > 0 && (
            <div className="flex items-center space-x-1 md:space-x-2 text-gray-700">
              <button
                onClick={handleDecrement}
                disabled={quantity === 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center border
                    ${
                      quantity === 1
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    } transition-colors`}
              >
                <Minus size={16} />
              </button>

              <span className="w-8 text-center font-medium">{quantity}</span>

              <button
                onClick={handleIncrement}
                disabled={quantity >= product.stock}
                className={`w-8 h-8 rounded-full flex items-center justify-center border
                    ${
                      quantity >= product.stock
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    } transition-colors`}
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>

        {/* AddToCartButton*/}
        <AddToCartButton
          productId={product.id}
          stock={product.stock}
          quantity={quantity}
        />
      </div>
      {/* Indicador de stock */}
      {typeof product.stock !== "undefined" && (
        <div className="flex items-center mt-2">
          <div className="flex-grow bg-gray-200 rounded-full h-2">
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
          <span
            className={`text-xs ml-2 ${
              product.stock === 0 ? "text-red-600 font-medium" : "text-gray-500"
            }`}
          >
            {product.stock === 0
              ? "Sin stock"
              : `${product.stock} disponible${product.stock !== 1 ? "s" : ""}`}
          </span>
        </div>
      )}
    </div>
  );
}
