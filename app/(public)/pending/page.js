"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Pending() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paymentId = searchParams?.get('payment_id');
  const orderId = searchParams?.get('order_id');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error('Error al obtener los detalles de la orden');
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-['Montserrat']">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg 
                className="w-10 h-10 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pago Pendiente
            </h1>
            <p className="text-gray-600 text-lg font-['Roboto']">
              Tu orden ha sido registrada y está esperando confirmación de pago
            </p>
          </div>

          {order && (
            <>
              {/* Order Details Section */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 font-['Roboto']">Número de orden</p>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-['Roboto']">Total a pagar</p>
                      <p className="font-semibold text-gray-900">${Number(order.total).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 font-['Roboto']">Estado</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-600">
                        Pendiente
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-['Roboto']">Método de pago</p>
                      <p className="font-semibold text-gray-900 capitalize">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              {(order.paymentMethod === 'ticket'||order.paymentMethod === 'pagofacil'||order.paymentMethod === 'rapipago') && (
                <div className="bg-red-50 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Instrucciones de pago
                  </h3>
                  <div className="space-y-4 font-['Roboto'] text-gray-700">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold">1</span>
                      <p className="ml-4">Dirígete a tu punto de pago más cercano</p>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold">2</span>
                      <div className="ml-4">
                        <p>Muestra este código:</p>
                        <code className="mt-2 block bg-white px-4 py-2 rounded-lg font-mono text-red-600">{paymentId}</code>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold">3</span>
                      <p className="ml-4">Realiza el pago por el monto exacto</p>
                    </div>
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold">4</span>
                      <p className="ml-4">Guarda tu comprobante de pago</p>
                    </div>
                  </div>
                  <p className="mt-6 text-sm text-red-600 bg-red-100 p-4 rounded-lg">
                    * El pago puede demorar hasta 24 horas en ser procesado
                  </p>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
            >
              Ver mis órdenes
            </Link>
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}