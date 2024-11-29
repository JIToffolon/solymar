"use client";
import { useState, useEffect } from 'react';
import { Payment } from '@mercadopago/sdk-react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const { data: session } = useSession();
  const router = useRouter();
  const [preferenceId, setPreferenceId] = useState(null);
  const [orderAmount, setOrderAmount] = useState(null);
  
  useEffect(() => {
    if (!session) return;
    
    // Obtener los datos del carrito y crear la preferencia
    const fetchCartAndCreatePreference = async () => {
      try {
        // 1. Obtener datos del carrito
        const cartResponse = await fetch("/api/cart");
        const cartData = await cartResponse.json();
        
        if (!cartData.items || cartData.items.length === 0) {
          router.push("/cart");
          return;
        }

        // 2. Calcular el monto total
        const total = cartData.items.reduce(
          (sum, item) => sum + (Number(item.product.price) * item.quantity),
          0
        );
        setOrderAmount(total);

        // 3. Crear la preferencia
        const preferenceResponse = await fetch("/api/create-preference", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartData.items.map(item => ({
              id: item.product.id,
              title: item.product.name,
              quantity: item.quantity,
              unit_price: Number(item.product.price)
            })),
            payer: {
              email: session.user.email
            }
          }),
        });

        const preferenceData = await preferenceResponse.json();
        setPreferenceId(preferenceData.id);
      } catch (error) {
        console.error("Error fetching cart or creating preference:", error);
      }
    };

    fetchCartAndCreatePreference();
  }, [session,router]);

  const initialization = {
    amount: orderAmount,
    preferenceId: preferenceId,
  };

  const customization = {
    paymentMethods: {
      ticket: "all",
      creditCard: "all",
      debitCard: "all",
      mercadoPago: "all",
    },
  };

  const onSubmit = async ({ selectedPaymentMethod, formData }) => {
    return new Promise((resolve, reject) => {
      fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((response) => {
          // Manejar respuesta exitosa
          if (response.status === "approved") {
            router.push("/success");
          } else {
            router.push("/failure");
          }
          resolve();
        })
        .catch((error) => {
          console.error("Payment error:", error);
          reject();
        });
    });
  };

  const onError = async (error) => {
    console.error("Brick error:", error);
  };

  const onReady = async () => {
    // Aquí puedes ocultar loading spinners si los tienes
    console.log("Brick ready");
  };

  if (!preferenceId || !orderAmount) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-center ">Checkout</h1>
      <div id="payment-form">
        <Payment
          initialization={initialization}
          customization={customization}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onError}
        />
      </div>
    </div>
  );
}