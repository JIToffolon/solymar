import "./globals.css";
import Layout from "./components/Layout";
import { monserrat } from "./ui/fonts";
import { CartProvider } from "./context/CartContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <CartProvider>
        <body className={`${monserrat.className} antialiased bg-white`}>
          <Layout>{children}</Layout>
        </body>
      </CartProvider>
    </html>
  );
}
