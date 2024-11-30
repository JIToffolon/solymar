"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { withAdminAuth } from "../components/auth/withAdminAuth";

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState("week");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    recentOrders: [],
    salesByStatus: [],
    monthlySales: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) throw new Error("Error al cargar datos");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;
  }

  const COLORS = ["#10B981", "#F59E0B", "#EF4444"];
  const STATUS_COLORS = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };

  const STATUS_LABELS = {
    approved: "Aprobado",
    pending: "Pendiente",
    rejected: "Rechazado",
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value || 0);
  };

  const calculateOrdersPerDay = () => {
    const total = stats.totalOrders || 0;
    const days = 30; // Podemos ajustar esto según el dateRange
    return (total / days).toFixed(1);
  };

  const StatCard = ({ title, value, icon, description }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className="text-red-600 text-2xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* <div className="flex space-x-2 bg-white rounded-lg shadow">
          <button
            onClick={() => setDateRange("week")}
            className={`px-4 py-2 rounded-lg ${
              dateRange === "week" ? "bg-red-600 text-white" : "text-gray-600"
            }`}
          >
            7 días
          </button>
          <button
            onClick={() => setDateRange("month")}
            className={`px-4 py-2 rounded-lg ${
              dateRange === "month" ? "bg-red-600 text-white" : "text-gray-600"
            }`}
          >
            30 días
          </button>
          <button
            onClick={() => setDateRange("year")}
            className={`px-4 py-2 rounded-lg ${
              dateRange === "year" ? "bg-red-600 text-white" : "text-gray-600"
            }`}
          >
            12 meses
          </button>
        </div> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-gray-700">
        <StatCard
          title="Ventas Totales"
          value={formatCurrency(stats.totalSales)}
          icon="💰"
          description="Total de ventas en el período"
        />
        <StatCard
          title="Órdenes Totales"
          value={stats.totalOrders || 0}
          icon="📦"
          description={`Promedio: ${calculateOrdersPerDay()} por día`}
        />
        <StatCard
          title="Órdenes Pendientes"
          value={stats.pendingOrders || 0}
          icon="⏳"
          description="Órdenes sin procesar"
        />
        <StatCard
          title="Tasa de Aprobación"
          value={`${(
            ((stats.totalOrders - stats.pendingOrders) / stats.totalOrders) *
            100
          ).toFixed(1)}%`}
          icon="📈"
          description="Órdenes aprobadas vs total"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Ventas Mensuales */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Ventas Mensuales
          </h3>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlySales || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="text-gray-200"
                />
                <XAxis dataKey="month" tickFormatter={(value) => value} />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value).split(".")[0]}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Ventas"]}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ stroke: "#EF4444", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estado de Órdenes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estado de Órdenes
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.salesByStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value, percent }) =>
                    `${STATUS_LABELS[name]}: ${value} (${(
                      percent * 100
                    ).toFixed(0)}%)`
                  }
                >
                  {stats.salesByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Órdenes Recientes
          </h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 border-b">
                  <th className="pb-4 pr-6">ID</th>
                  <th className="pb-4 pr-6">Cliente</th>
                  <th className="pb-4 pr-6">Estado</th>
                  <th className="pb-4 pr-6">Fecha</th>
                  <th className="pb-4 pr-6 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="text-sm text-gray-700">
                    <td className="py-4 pr-6">#{order.id.slice(-8)}</td>
                    <td className="py-4 pr-6">{order.customerEmail}</td>
                    <td className="py-4 pr-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[order.status]
                        }`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="py-4 pr-6">
                      {new Date(order.createdAt).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 pr-6 text-right">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminDashboard);
