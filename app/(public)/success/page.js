"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Success() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener los parámetros directamente
  const paymentId = searchParams?.get("payment_id");
  const orderId = searchParams?.get("order_id");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderId) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Error al obtener los detalles de la orden");
        }

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-gray-700">
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="mb-6">
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Pago realizado con éxito!
          </h1>
          <p className="text-gray-600 mb-4">
            Tu orden ha sido procesada correctamente.
          </p>
        </div>

        <div className="border-t border-b border-gray-100 py-4 mb-6">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left mb-4">
            <p className="text-gray-600">ID de pago:</p>
            <p className="font-medium">{paymentId}</p>

            <p className="text-gray-600">ID de orden:</p>
            <p className="font-medium">{orderId}</p>

            {order && (
              <>
                <p className="text-gray-600">Total:</p>
                <p className="font-medium">${Number(order.total).toFixed(2)}</p>
              </>
            )}
          </div>

          {order && order.items && order.items.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Productos comprados:
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-4">
                      {item.product.imageUrl && (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width={400}
                          height={400}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="text-left">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Cantidad: {item.quantity} x $
                          {Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
