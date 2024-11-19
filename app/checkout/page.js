"use client";
import { useState, useEffect } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartData, setCartData] = useState(null);

  useEffect(() => {
    if (!session) return;
    
    const fetchCartData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/cart");
        if (!response.ok) throw new Error("Error fetching cart");
        const data = await response.json();
        setCartData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Inicializar MP solo una vez
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, {
      locale: 'es-AR'  // o el locale que corresponda a tu país
    });
    
    fetchCartData();
  }, [session]);

  const handleOnSubmit = async (formData) => {
    console.log("Submit triggered", formData);
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        console.log("Payment response:", data);
        if (data.error) {
          throw new Error(data.error);
        }
        resolve();
        if (data.status === "approved") {
          if (!data.order_id) {
            console.warn("No order_id received from server");
          }
          const successUrl = `/success?payment_id=${data.id}&order_id=${data.order_id || ''}`;
          console.log("Redirecting to:", successUrl);
          router.push(successUrl);
        } else {
          router.push(`/failure?payment_id=${data.id}`);
        }
      })
      .catch(error => {
        console.error("Payment error:", error);
        setError(error.message);
        reject();
      })
      .finally(() => {
        setIsLoading(false);
      });
    });
  };

  const handleOnError = (error) => {
    // Solo establecer el error si es realmente un error significativo
    if (error && Object.keys(error).length > 0) {
      console.error("Brick error:", error);
      setError("Error en el proceso de pago");
    }
  };

  const handleOnReady = () => {
    console.log("Brick ready");
    setIsLoading(false);
  };

  const total = cartData?.items.reduce(
    (sum, item) => sum + (Number(item.product.price) * item.quantity),
    0
  ) || 0;

  return (
    <div className="max-w-4xl mx-auto p-4 text-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
      
      {/* Resumen del pedido */}
      {cartData && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>
          <div className="space-y-4">
            {cartData.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center pb-2 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  {item.product.imageUrl && (
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${Number(item.product.price).toFixed(2)} c/u
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Brick */}
      {!isLoading && (
        <Payment
          initialization={{
            amount: total,
            preferenceId: undefined, // Solo si estás usando preferencias
            mercadoPago: "all"
          }}
          customization={{
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
            },
            visual: {
              style: {
                theme: 'default'
              }
            }
          }}
          onSubmit={handleOnSubmit}
          onReady={handleOnReady}
          onError={handleOnError}
        />
      )}
    </div>
  );
}