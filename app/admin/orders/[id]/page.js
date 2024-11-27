import OrdersDetailsClient from "@/app/components/OrdersDetailsClient";
import { Suspense } from "react";

async function OrderDetailsPage({ params }) {
  const {orderId} = await params;
  return (
    <Suspense fallback={<div>Cargando...</div>}>
    <OrdersDetailsClient orderId={orderId} />
    </Suspense>
  );
}

export default OrderDetailsPage;
