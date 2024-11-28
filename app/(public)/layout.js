import Navbar2 from "../components/Navbar2";
import Footer from "../components/footer";
import "../globals.css";
import { montserrat } from "../ui/fonts";
import WhatsAppButton from "../components/WhatsAppButton";

export default function PublicLayout({ children }) {
  return (
    <div className={`${montserrat.className} antialiased bg-white min-h-screen flex flex-col`}>
      <Navbar2 />
      <main className="flex-grow">{children}</main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
