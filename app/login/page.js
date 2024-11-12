import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Iniciar Sesión</h1>
      <LoginForm />
    </div>
  );
}
