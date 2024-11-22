"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto bg-gray-200 p-8 rounded-lg shadow-lg border border-gray-100 text-gray-700"
    >
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

      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          placeholder="Tu nombre"
          className="mt-1 block w-full px-4 py-3 border-none rounded-md"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          placeholder="ejemplo@email.com"
          className="mt-1 block w-full px-4 py-3 border rounded-md"
        />
        <p className="mt-1 text-sm text-gray-500">
          Nunca compartiremos tu email con nadie más.
        </p>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          id="password"
          required
          placeholder="••••••••"
          className="mt-1 block w-full px-4 py-3 border  rounded-md"
        />
        <p className="mt-1 text-sm text-gray-500">Mínimo 8 caracteres</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            required
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
            Acepto los{" "}
            <a href="#" className="text-red-600 hover:text-red-700 font-medium">
              términos y condiciones
            </a>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none font-medium transition-colors shadow-sm hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Crear cuenta
        </button>
      </div>

      <div className="text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <a
          href="/login"
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Inicia sesión aquí
        </a>
      </div>
    </form>
  );
}
