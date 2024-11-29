"use client";
import { useState, useEffect } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Checkout() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartData, setCartData] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const [isBrickReady, setIsBrickReady] = useState(false);

  useEffect(() => {
    if (!session) return;

    const initializeCheckout = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Inicializar MP
        initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, {
          locale: "es-AR",
        });

        // 2. Obtener datos del carrito
        const cartResponse = await fetch("/api/cart");
        if (!cartResponse.ok) throw new Error("Error al obtener el carrito");
        const cartData = await cartResponse.json();

        if (!cartData.items || cartData.items.length === 0) {
          router.push("/cart");
          return;
        }

        setCartData(cartData);

        // 3. Crear preferencia
        const preferenceResponse = await fetch("/api/create-preference", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartData.items.map((item) => ({
              id: item.product.id,
              title: item.product.name,
              description: item.product.description || item.product.name,
              quantity: item.quantity,
              currency_id: "ARS",
              unit_price: Number(item.product.price),
            })),
          }),
        });

        if (!preferenceResponse.ok) {
          throw new Error("Error al crear la preferencia de pago");
        }

        const { id: prefId } = await preferenceResponse.json();
        setPreferenceId(prefId);
      } catch (err) {
        console.error("Initialization error:", err);
        setError(err.message || "Error al inicializar el checkout");
      } finally {
        setIsLoading(false);
      }
    };

    initializeCheckout();
  }, [session, router]);

  const handleOnSubmit = async ({ selectedPaymentMethod, formData }) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method: selectedPaymentMethod,
          formData: {
            ...formData,
            transaction_amount: total, // Asegurarnos de enviar el monto total
          },
          preferenceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar el pago");
      }

      switch (data.status) {
        case "approved":
          router.push(
            `/success?payment_id=${data.id}&order_id=${data.order_id}`
          );
          break;
        case "pending":
          router.push(
            `/pending?payment_id=${data.id}&order_id=${data.order_id}`
          );
          break;
        case "rejected":
          router.push(
            `/failure?payment_id=${data.id}&order_id=${data.order_id}`
          );
          break;
        default:
          router.push(
            `/pending?payment_id=${data.id}&order_id=${data.order_id}`
          );
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Error al procesar el pago");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnError = (error) => {
    if (error && Object.keys(error).length > 0) {
      console.error("Brick error:", error);
      setError("Error en el proceso de pago");
    }
  };

  const handleOnReady = () => {
    console.log("Brick ready");
    setIsBrickReady(true);
    setIsLoading(false);
  };

  const total =
    cartData?.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    ) || 0;

  if (isLoading) {
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
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>

      {cartData && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>
          <div className="space-y-4">
            {cartData.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center pb-2 border-b border-gray-100"
              >
                <div className="flex items-center space-x-4">
                  {item.product.imageUrl && (
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      width={200}
                      height={200}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.quantity}
                    </p>
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

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          Métodos de pago disponibles
        </h2>
        <Payment
          initialization={{
            amount: total,
            preferenceId: preferenceId,
          }}
          customization={{
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              minInstallments: 1,
              maxInstallments: 6,
              // mercadoPago: "all",
              // ticket: "all",
            },
            visual: {
              style: {
                theme: "default",
              },
            },
          }}
          onSubmit={handleOnSubmit}
          onReady={handleOnReady}
          onError={handleOnError}
        />
      </div>
    </div>
  );
}
