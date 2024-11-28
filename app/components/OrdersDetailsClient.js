"use client";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { roboto } from "../ui/fonts";
import { useRouter } from "next/navigation";

const OrderDetailsClient = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderId = useParams();
  const router = useRouter();
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        console.log("No hay orderId"); // Debugging
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching order with ID:", orderId.id); // Debugging

        const res = await fetch(`/api/admin/orders/${orderId.id}`);
        console.log("Response status:", res.status); // Debugging

        if (!res.ok) throw new Error("Error al cargar la orden");
        const data = await res.json();

        console.log("Datos recibidos:", data); // Debugging
        setOrder(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
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
  };

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
    <div className={`${roboto.className} min-h-screen bg-gray-50 p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
        </div>

        <div
          className={`${roboto.className} bg-white rounded-lg shadow p-6 mb-6 text-gray-700`}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Orden #{order.id}
              </h1>
              <p className="text-gray-600">
                Fecha: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
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
                className="mt-2 px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-200 py-4">
            <h2 className="text-lg font-semibold mb-4">
              Información del Cliente
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{order.user.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Nombre</p>
                <p className="font-medium">
                  {order.user.name || "No especificado"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 py-4">
            <h2 className="text-lg font-semibold mb-4">Productos</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <img
                      src={item.product.imageUrl || "/placeholder.png"}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.price}</p>
                    <p className="text-sm text-gray-500">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Total</h2>
              <p className="text-xl font-bold">${order.total}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h2 className="text-lg font-semibold mb-4">Información de Pago</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Método de Pago</p>
                <p className="font-medium">
                  {order.paymentMethod || "No especificado"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">ID de Pago</p>
                <p className="font-medium">
                  {order.paymentId || "No disponible"}
                </p>
                <p className="text-gray-600">Cuotas</p>
                <p className="font-medium">{order.installments}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsClient;
