//DEBUGG

'use client';
import React, { useEffect, useState } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const CheckoutForm = () => {
  const { data: session } = useSession();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      if (session) {
        const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
        initMercadoPago(publicKey);
        await fetchCart();
      }
    };
    init();
  }, [session]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error fetching cart');
      }
      const data = await response.json();
      console.log('Cart data:', data); // Debug
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err); // Debug
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);
  };

  // const onSubmit = async (formData) => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch('/api/process-payment', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ formData }),
  //     });
  
  //     const result = await response.json();
      
  //     if (result.success) {
  //       alert('¡Pago exitoso!');
  //       router.push('/checkout/success');
  //     } else {
  //       alert(result.message || 'Error en el proceso de pago');
  //       router.push('/checkout/failure');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('Error en el proceso de pago');
  //     router.push('/checkout/failure');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const onSubmit = async (formData) => {
    try {
      console.log('Iniciando pago con datos:', formData);
  
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });
  
      const result = await response.json();
      console.log('Resultado del pago:', result);
  
      if (result.success) {
        router.push('/checkout/success');
      } else {
        console.error('Error en el pago:', result.message);
        router.push('/checkout/failure');
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/checkout/failure');
    }
  };

  if (!session) {
    return <div className="text-center py-8">Please log in to continue</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="text-center py-8">
        Tu carrito está vacío
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-gray-700">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-6">Finalizar Compra</h2>
        
        <div className="mb-6">
          <h3 className="font-medium mb-4">Resumen del pedido:</h3>
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <span>{item.product.name} x{item.quantity}</span>
              <span>${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-red-600">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Payment
          initialization={{
            amount: calculateTotal()
          }}
          onSubmit={onSubmit}
          customization={{
            paymentMethods: {
              creditCard: 'all',
              debitCard: 'all'
            }
          }}
        />
      </div>
    </div>
  );
};

export default CheckoutForm;