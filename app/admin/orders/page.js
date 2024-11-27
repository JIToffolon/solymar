import { Suspense } from "react";
import OrdersListClient from "@/app/components/OrdersListClient";

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <OrdersListClient />
    </Suspense>
  );
}
