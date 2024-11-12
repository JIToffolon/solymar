import AddToCartButton from "./addToCartButton";
import { useState } from "react";
import Link from "next/link";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    
    <div 
      className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor de imagen con tamaño fijo */}
      <Link href={`/products/${product.id}`}>

      <div className="relative w-full h-[300px]">
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
                className="w-16 h-16 text-gray-400" 
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
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Badge de "Nuevo" si el producto lo requiere */}
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-medium rounded-full">
            Nuevo
          </span>
        )}
      </div>
        </Link>

      {/* Contenido del producto */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 min-h-[40px]">
            {product.description}
          </p>
        </div>

        {/* Precio y botón */}
        <div className="pt-4 border-t border-gray-100 mt-4">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
              <span className="text-xl font-bold text-red-600">
                ${Number(product.price).toFixed(2)}
              </span>
            </div>
            <AddToCartButton productId={product.id} />
          </div>

          {/* Indicador de stock */}
          {typeof product.stock !== 'undefined' && (
            <div className="flex items-center mt-2">
              <div className="flex-grow bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((product.stock / 100) * 100, 100)}%`
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {product.stock} disponibles
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}