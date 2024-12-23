import Link from 'next/link';
import SubscribeButton from '@/components/SubscribeButton';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-blue-50 to-white">
      {/* Menú */}
      <header className="w-full bg-white shadow">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">
            LegalIA Honduras
          </Link>
          <div>
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="ml-4 text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Registrarse
            </Link>
          </div>
        </nav>
      </header>

      {/* Banner de Prueba Gratuita */}
      <div className="w-full bg-blue-600 p-3">
        <p className="text-center text-sm text-white">
          ¡Prueba gratuita por 7 días! Sin compromiso, accede a todas las funciones premium.{" "}
          <a href="/register" className="underline hover:text-blue-200">
            Comenzar ahora →
          </a>
        </p>
      </div>

      {/* Header/Hero Section */}
      <div className="w-full max-w-6xl px-4 pt-16">
        {/* ... */}
      </div>

      {/* Ejemplos de Consultas */}
      <div className="my-12">
        {/* ... */}
      </div>

      {/* Features Section */}
      <div className="my-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* ... */}
      </div>

      {/* Testimonios */}
      <div className="my-16">
        {/* ... */}
      </div>

      {/* Pricing Section */}
      <div className="my-16">
        {/* ... */}
      </div>
    </div>
  );
}
