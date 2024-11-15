import { roboto } from "../ui/fonts"
import CheckOutForm from "../components/CheckOutForm"

export default function Checkout() {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className={`${roboto.className} text-3xl text-center font-bold text-gray-900 mb-8`}>
          Finalizar Compra
        </h1>
        <CheckOutForm />
      </main>
    )
  }