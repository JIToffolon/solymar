// import { NextResponse } from 'next/server'
// import bcrypt from 'bcryptjs'
// import prisma from '@/app/lib/prisma'

// export async function POST(req) {
//   try {
//     const { email, password, name } = await req.json()

//     // Verificar si el usuario ya existe
//     const existingUser = await prisma.user.findUnique({
//       where: { email }
//     })

//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'El usuario ya existe' },
//         { status: 400 }
//       )
//     }

//     // Encriptar contraseña
//     const hashedPassword = await bcrypt.hash(password, 10)

//     // Crear usuario
//     const user = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         name,
//         cart: {
//           create: {} // Crear carrito automáticamente
//         }
//       }
//     })

//     const { password: _, ...userWithoutPassword } = user
//     return NextResponse.json(userWithoutPassword)
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Error al registrar usuario' },
//       { status: 500 }
//     )
//   }
// }
////////////////////////////////////////////////////////////////////////////////////

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario y carrito
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        cart: {
          create: {}, // Crear carrito vacío automáticamente
        },
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
