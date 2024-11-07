import React from 'react';
import AuthForm from './components/AuthForm';

// app/page.js o app/home/page.js (dependiendo de cómo esté estructurada tu aplicación)
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow mt-5 home-container">
      <h1 className="text-3xl font-bold text-gray-700">Bienvenido a Solymar</h1>
      <p className="mt-4 text-center text-gray-600">
        Explora nuestros productos y encontrá las mejores ofertas para tu hogar.
      </p>
      <div>
        <AuthForm/>
      </div>
      <div className='featured-products'>
        {/* Lista de productos destacados en un futuro */}
      </div>
    </div>
  );
}

