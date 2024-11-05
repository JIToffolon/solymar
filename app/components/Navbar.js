import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { monserrat } from "../ui/fonts";
import { roboto } from "../ui/fonts";

export default function Navbar() {
  return (
    // <nav className="bg-red-600 text-white">
    //   <div className={`container flex  items-center justify-between mx-auto ${monserrat.className}`}>
    //     <Link href="/">
    //       <Image
    //         src={"/logo3.png"}
    //         className="hidden md:block"
    //         width={80}
    //         height={80}
    //         alt="Logo Solymar"
    //       />
    //     </Link>
    //     <Link href="/" className="text-2xl font-bold">
    //       Solymar
    //     </Link>
    //     <div className=" gap-5 flex flex-row items-center">
    //       <Link href="/" className="cursor-pointer">
    //         Inicio
    //       </Link>
    //       <Link href="/productos" className="cursor-pointer">
    //         Productos
    //       </Link>
    //       <Link href="/contacto" className="cursor-pointer">
    //         Contacto
    //       </Link>
    //       <Link href="/carrito" className="cursor-pointer">
    //         <ShoppingCartIcon className="w-8 h-8" />
    //       </Link>
    //     </div>
    //   </div>
    // </nav>
    <nav className="bg-red-600 text-white py-4 shadow-md">
      <div
        className={`container mx-auto flex justify-between items-center ${monserrat.className}`}
      >
        <div className="flex items-center">
          <Link href="/">
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
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="hover:text-gray-300 transition-colors duration-300"
          >
            Inicio
          </Link>
          <Link
            href="/productos"
            className="hover:text-gray-300 transition-colors duration-300"
          >
            Productos
          </Link>
          <Link
            href="/contacto"
            className="hover:text-gray-300 transition-colors duration-300"
          >
            Contacto
          </Link>
          <Link
            href="/carrito"
            className="hover:text-gray-300 transition-colors duration-300"
          >
            <ShoppingCartIcon className="w-7 h-7" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
