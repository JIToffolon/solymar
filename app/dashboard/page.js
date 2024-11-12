// // pages/dashboard.js
// 'use client'
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import AuthForm from '../components/AuthForm';

// export default function Dashboard() {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       // router.push('/'); // Redirige si el usuario no está autenticado
//     }
//   }, [router]);

//   return (
//     <div>
//       <h1 className='text-center text-3xl font-bold text-gray-700 mt-10'>Bienvenido al Dashboard</h1>
//       <AuthForm/>
//     </div>
//   );
// }


'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Dashboard</h1>
      {session && (
        <div className="bg-white shadow rounded-lg p-6 text-gray-700">
          <h2 className="text-xl font-semibold mb-4">
            Bienvenido, {session.user.name || session.user.email}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Mi Perfil</h3>
              <p>Email: {session.user.email}</p>
              <p>ID: {session.user.id}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Actividad Reciente</h3>
              <p>Último acceso: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}