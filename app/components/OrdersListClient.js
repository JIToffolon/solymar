"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import Pagination from "./Pagination";

const OrdersListClient = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    id: "",
    status: "",
    dateRange: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/orders?page=${currentPage}&limit=${limit}`
      );
      if (!res.ok) throw new Error("Error al cargar órdenes");
      const data = await res.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders =
    orders?.filter((order) => {
      const matchesId =
        !filters.id ||
        order.id.toLowerCase().includes(filters.id.toLowerCase());
      const matchesStatus = !filters.status || order.status === filters.status;

      let matchesDate = true;
      if (filters.dateRange !== "all") {
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        const daysDiff = (today - orderDate) / (1000 * 60 * 60 * 24);

        matchesDate =
          filters.dateRange === "today"
            ? daysDiff < 1
            : filters.dateRange === "week"
            ? daysDiff < 7
            : filters.dateRange === "month"
            ? daysDiff < 30
            : true;
      }

      return matchesId && matchesStatus && matchesDate;
    }) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-red-700 mb-6">
          Órdenes de Compra
        </h1>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID de Orden
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.id}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, id: e.target.value }))
                }
                placeholder="Buscar por ID..."
                className="w-full border border-gray-300 rounded-md pl-8 p-2 text-gray-700"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateRange: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
            >
              <option value="all">Todas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {order.id}
                            </span>
                            {/* Info adicional visible solo en móvil */}
                            <div className="sm:hidden space-y-1 mt-1">
                              <span className="text-xs text-gray-500 block">
                                {order.user?.email}
                              </span>
                              <span className="text-xs text-gray-500 block">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Columnas ocultas en móvil */}
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.user?.email}
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${order.total}
                        </td>

                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-red-600 hover:text-red-900"
                          >
                            Ver detalles
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Paginación */}
          <div className="px-3 sm:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="py-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersListClient;
