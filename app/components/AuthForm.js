// // components/AuthForm.js
// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function AuthForm() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({ email: '', password: '', name: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // Nuevo estado para autenticación
//   const router = useRouter();

//   useEffect(() => {
//     // Comprueba si ya hay un token al cargar el componente
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
//     const payload = isLogin ? { email: formData.email, password: formData.password } : formData;

//     try {
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         setError(result.error || 'Authentication failed');
//         setLoading(false);
//         return;
//       }

//       // Almacena el token en localStorage y actualiza el estado de autenticación
//       localStorage.setItem('token', result.token);
//       setIsAuthenticated(true);
//       alert(isLogin ? 'Inicio de sesión exitoso' : 'Registro exitoso');
//       router.push('/dashboard');
//     } catch (err) {
//       console.error('Error:', err);
//       setError('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     // Elimina el token del almacenamiento local y actualiza el estado de autenticación
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//     alert('Sesión cerrada');
//     router.push('/'); // Redirige a la página principal o de inicio de sesión
//   };

//   return (
//     <div className="max-w-md mx-auto my-10 bg-slate-200 p-6 rounded-lg shadow-xl">
//       {isAuthenticated ? (
//         <div className="text-center">
//           <p className="text-lg font-semibold text-gray-700">Ya has iniciado sesión</p>
//           <button
//             onClick={handleLogout}
//             className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
//           >
//             Cerrar Sesión
//           </button>
//         </div>
//       ) : (
//         <>
//           <div className="flex justify-center mb-6">
//             <button
//               onClick={() => setIsLogin(true)}
//               className={`w-1/2 py-2 font-bold ${isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
//             >
//               Iniciar Sesión
//             </button>
//             <button
//               onClick={() => setIsLogin(false)}
//               className={`w-1/2 py-2 font-bold ${!isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
//             >
//               Registrarse
//             </button>
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {!isLogin && (
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required={!isLogin}
//                   className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
//                 />
//               </div>
//             )}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//             >
//               {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
//             </button>
//           </form>
//           {error && <p className="text-red-500 text-center mt-4">{error}</p>}
//         </>
//       )}
//     </div>
//   );
// }


// components/AuthForm.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para la autenticación
  const router = useRouter();

  // Verificar el token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validar el token con el backend
      fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Enviar el token en los encabezados
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.isValid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email: formData.email, password: formData.password } : formData;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      // Almacena el token en localStorage y actualiza el estado de autenticación
      localStorage.setItem('token', result.token);
      setIsAuthenticated(true);
      alert(isLogin ? 'Inicio de sesión exitoso' : 'Registro exitoso');
      router.push('/dashboard');
    } catch (err) {
      console.error('Error:', err);
      setError('Ha ocurrido un error. Por favor, inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Elimina el token del almacenamiento local y actualiza el estado de autenticación
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    alert('Sesión cerrada');
    router.push('/'); // Redirige a la página principal o de inicio de sesión
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-slate-200 p-6 rounded-lg shadow-xl">
      {isAuthenticated ? (
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Ya has iniciado sesión</p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 font-bold ${isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 font-bold ${!isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            >
              Registrarse
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </form>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </>
      )}
    </div>
  );
}
