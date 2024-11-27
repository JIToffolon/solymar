"use client";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { ShoppingCartIcon } from "@heroicons/react/16/solid";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-red-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-red-100"
            >
              <Image
                src="/logo3.png"
                alt="Logo Solymar"
                width={65}
                height={50}
              />
            </Link>
            <Link href="/" className="text-2xl font-bold">
              Solymar
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href={'/products'}>
                <span className="text-white">
                  Marketplace
                </span>
                </Link>
                <Link
                  href="/dashboard"
                  className="text-white hover:text-red-100 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/carrito"
                  className="text-white hover:text-red-100 transition-colors"
                >
                  <ShoppingCartIcon className="w-7 h-7" />
                </Link>
                <button
                  onClick={() => signOut({callbackUrl:'/login'})}
                  className="bg-white text-red-600 px-4 py-2 rounded hover:bg-red-100 transition-colors font-medium"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-red-100 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-red-600 px-4 py-2 rounded hover:bg-red-100 transition-colors font-medium"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
