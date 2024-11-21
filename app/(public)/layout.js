import AuthProvider from "../components/AuthProvider";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/footer";
import "../globals.css";
import { monserrat } from "../ui/fonts";
import WhatsAppButton from "../components/WhatsAppButton";

export default function PublicLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${monserrat.className} antialiased bg-white `}>
        <AuthProvider>
          <div className="estructura">
            <Navbar2 />
            <main className="max-w-[100%] mx-auto px-4 py-8">{children}</main>
            <WhatsAppButton />
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}