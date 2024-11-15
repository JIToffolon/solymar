// app/checkout/failure/page.js
'use client';
import Link from 'next/link';

export default function FailurePage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg 
            className="w-8 h-8 text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          El pago no pudo completarse
        </h1>
        
        <p className="text-gray-600 mb-8">
          Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
        </p>

        <div className="space-y-4">
          <Link 
            href="/checkout"
            className="block w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Intentar nuevamente
          </Link>
          
          <Link 
            href="/cart"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Volver al carrito
          </Link>
        </div>
      </div>
    </div>
  );
}