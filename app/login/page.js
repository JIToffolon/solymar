import React from 'react';
import LoginForm from '../components/LoginForm';

// app/page.js o app/home/page.js (dependiendo de cómo esté estructurada tu aplicación)
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow mt-5 home-container">
      <LoginForm/>
    </div>
  );
}