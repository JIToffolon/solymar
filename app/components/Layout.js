import Navbar from "./Navbar";
import { roboto } from "../ui/fonts";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-4">{children}</main>{" "}
      {/* Este espacio debe ser flexible */}
      <footer className={`bg-red-600 text-white text-center p-4 ${roboto.className}`}>
        © 2024 Solymar. Todos los derechos reservados.
      </footer>
    </div>
  );
}
