
"use client";
import { useSession } from 'next-auth/react';
import { useRouter,useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  // const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // const orderId = searchParams?.get('order_id');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders`);
      const data = await response.json();
      console.log(data);
      
      // Filtrar solo órdenes aprobadas y pendientes
      const filteredOrders = data.filter(order => 
        ['approved', 'pending'].includes(order.status)
      );
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 font-['Montserrat']">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Mi Dashboard</h1>
      {session && (
        <>
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Bienvenido, {session.user.name || session.user.email}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-6 rounded-xl">
                <h3 className="font-semibold mb-4 text-gray-900">Mi Perfil</h3>
                <div className="space-y-2 font-['Roboto']">
                  <p className="text-gray-600">Email: {session.user.email}</p>
                  <p className="text-gray-600">ID: {session.user.id}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold mb-4 text-gray-900">Actividad Reciente</h3>
                <p className="text-gray-600 font-['Roboto']">
                  Último acceso: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Mis Órdenes de Compra</h2>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} 
                    className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          Orden #{order.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 font-['Roboto']">
                          Fecha: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          ${order.status === 'approved' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-red-50 text-red-600'}`}>
                          {order.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                        </span>
                        <p className="mt-1 font-semibold text-gray-900">
                          ${Number(order.total).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link 
                        href={`/orders/${order.id}`}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Ver detalles →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8 font-['Roboto']">
                No tienes órdenes registradas
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}