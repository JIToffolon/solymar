import React from 'react';
import RegisterForm from '../components/RegisterForm';

// app/page.js o app/home/page.js (dependiendo de cómo esté estructurada tu aplicación)
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow mt-5 home-container">
      <RegisterForm/>
    </div>
  );
}