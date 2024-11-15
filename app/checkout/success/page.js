// app/checkout/success/page.js
'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  
  const router = useRouter();
  useEffect(() => {
    // Limpiar el carrito
    fetch('/api/cart', { method: 'DELETE' });
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg 
            className="w-8 h-8 text-green-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          ¡Pago realizado con éxito!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Gracias por tu compra. Te enviaremos un email con los detalles de tu pedido.
        </p>

        <div className="space-y-4">
          <Link 
            href="/orders"
            className="block w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Ver mis pedidos
          </Link>
          
          <Link 
            href="/products"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}