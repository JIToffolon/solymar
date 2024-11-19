import { MercadoPagoConfig } from 'mercadopago';

export const createPreference = async (items, userId) => {
  const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
  });

  try {
    const url = 'https://api.mercadopago.com/checkout/preferences';
    
    const preferenceData = {
      items: items.map(item => ({
        title: item.product.name,
        unit_price: Number(item.product.price),
        quantity: item.quantity,
        currency_id: "ARS"
      })),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/success`,
        failure: `${process.env.NEXT_PUBLIC_URL}/failure`
      },
      auto_return: "approved"
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferenceData)
    });

    if (!response.ok) {
      throw new Error('Error creating preference');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}