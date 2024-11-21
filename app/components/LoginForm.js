"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/dashboard"); 
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-100">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-100 flex items-center">
          <svg 
            className="w-5 h-5 mr-2 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          placeholder="ejemplo@email.com"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          required
          className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          placeholder="••••••••"
        />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 block text-gray-600">
            Recordarme
          </label>
        </div>
        <a href="#" className="text-red-600 hover:text-red-700 font-medium">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium transition-colors shadow-sm hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Iniciar sesión
      </button>
      
      <div className="text-center text-sm text-gray-600">
        ¿No tienes una cuenta?{' '}
        <a href="/register" className="text-red-600 hover:text-red-700 font-medium">
          Regístrate aquí
        </a>
      </div>
    </form>
  );
}
