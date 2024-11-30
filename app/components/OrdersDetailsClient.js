"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { roboto } from "../ui/fonts";
import { useRouter } from "next/navigation";
import Image from "next/image";

const OrderDetailsClient = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderId = useParams();
  const router = useRouter();

  const fetchOrder = useCallback(async (id) => {
    if (!id) {
      console.log("No hay orderId");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching order with ID:", id);

      const res = await fetch(`/api/admin/orders/${id}`);
      console.log("Response status:", res.status);

      if (!res.ok) throw new Error("Error al cargar la orden");
      const data = await res.json();

      console.log("Datos recibidos:", data);
      setOrder(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStatusChange = useCallback(
    async (newStatus) => {
      try {
        const res = await fetch(`/api/admin/orders/${orderId.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) throw new Error("Error al actualizar estado");

        const updatedOrder = await res.json();
        setOrder(updatedOrder);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [orderId]
  );

  useEffect(() => {
    if (orderId?.id) {
      fetchOrder(orderId.id);
    }
  }, [orderId, fetchOrder]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        Cargando...
      </div>
    );
  }

  if (!order) {
    return <div>Orden no encontrada</div>;
  }

  return (
    <div className={`${roboto.className} min-h-screen bg-gray-50 p-3 sm:p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-4 sm:mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
        </div>

        <div
          className={`${roboto.className} bg-white rounded-lg shadow p-4 sm:p-6 mb-6 text-gray-700`}
        >
          {/* Header y Estado */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Orden #{order.id}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Fecha: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
              </select>
            </div>
          </div>

          {/* Información del Cliente */}
          <div className="border-t border-gray-200 py-4">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Información del Cliente
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-sm sm:text-base font-medium">
                  {order.user.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="text-sm sm:text-base font-medium">
                  {order.user.name || "No especificado"}
                </p>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="border-t border-gray-200 py-4">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Productos
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-center">
                    <Image
                      src={item.product.imageUrl || "/placeholder.png"}
                      alt={item.product.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                      width={300}
                      height={300}
                    />
                    <div className="ml-3 sm:ml-4">
                      <p className="text-sm sm:text-base font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-auto sm:ml-0">
                    <p className="text-sm sm:text-base font-medium">
                      ${item.price}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-semibold">Total</h2>
              <p className="text-lg sm:text-xl font-bold">${order.total}</p>
            </div>
          </div>

          {/* Información de Pago */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Información de Pago
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Método de Pago</p>
                <p className="text-sm sm:text-base font-medium">
                  {order.paymentMethod || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID de Pago</p>
                <p className="text-sm sm:text-base font-medium break-all">
                  {order.paymentId || "No disponible"}
                </p>
                <p className="text-sm text-gray-600 mt-2">Cuotas</p>
                <p className="text-sm sm:text-base font-medium">
                  {order.installments}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsClient;
