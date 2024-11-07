// pages/dashboard.js
'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/'); // Redirige si el usuario no está autenticado
    }
  }, [router]);

  return (
    <div>
      <h1>Bienvenido al Dashboard</h1>
      {/* Contenido del dashboard */}
    </div>
  );
}
