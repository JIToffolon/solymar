import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MP_ACCESS_TOKEN
    });

    const preference = new Preference(client);

    const preferenceData = {
      items: data.items,
      payer: {
        email: session.user.email
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`
      },
      auto_return: "approved",
      statement_descriptor: "SOLYMAR HOGAR",
      payment_methods: {
        excluded_payment_types: [
          { id: "atm" },
          { id: "bank_transfer" }
        ],
        installments: 6
      }
    };

    const result = await preference.create({ body: preferenceData });
    
    return NextResponse.json({
      id: result.id,
      init_point: result.init_point
    });

  } catch (error) {
    console.error("Error creating preference:", error);
    return NextResponse.json(
      { error: "Error al crear la preferencia" },
      { status: 500 }
    );
  }
}