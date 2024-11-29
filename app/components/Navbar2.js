"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { ShoppingCartIcon } from "@heroicons/react/16/solid";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = session ? [
    { href: '/products', label: 'Marketplace' },
    { href: '/dashboard', label: 'Dashboard' },
  ] : [];

  return (
    <nav className="bg-red-600 shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold text-white hover:text-red-100">
              <Image
                src="/logo3.png"
                alt="Logo Solymar"
                width={60}
                height={60}
              />
            </Link>
            <Link href="/" className="text-2xl font-bold text-white">
              Solymar
            </Link>
          </div>

          {/* Menú desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-red-100 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {session && (
              <Link
                href="/carrito"
                className="text-white hover:text-red-100 transition-colors"
              >
                <ShoppingCartIcon className="w-7 h-7" />
              </Link>
            )}
            {session ? (
              <button
                onClick={() => signOut({callbackUrl:'/login'})}
                className="bg-white text-red-600 px-4 py-2 rounded hover:bg-red-100 transition-colors font-medium"
              >
                Cerrar Sesión
              </button>
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

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center">
            {session && (
              <Link
                href="/carrito"
                className="text-white hover:text-red-100 transition-colors mr-4"
              >
                <ShoppingCartIcon className="w-7 h-7" />
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="text-white hover:text-red-100 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg"
            >
              <div className="flex flex-col p-4">
                <div className="flex justify-end">
                  <button
                    onClick={toggleMenu}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={24} />
                  </button>
                </div>
                {menuItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="py-2 text-gray-600 hover:text-red-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {session ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut({callbackUrl:'/login'});
                    }}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-medium"
                  >
                    Cerrar Sesión
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      href="/login"
                      className="text-center text-red-600 hover:text-red-700 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/register"
                      className="text-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}