import Navbar2 from "../components/Navbar2";
import Footer from "../components/footer";
import "../globals.css";
import { montserrat } from "../ui/fonts";
import WhatsAppButton from "../components/WhatsAppButton";

export default function PublicLayout({ children }) {
  return (
    
      <div className={`${montserrat.className} antialiased bg-white `}>
        
          <div className="estructura">
            <Navbar2 />
            <main className="max-w-[100%] mx-auto px-4 py-8">{children}</main>
            <WhatsAppButton />
            <Footer />
          </div>
       
      </div>
    
  );
}