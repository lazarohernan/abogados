import SubscribeButton from '@/components/SubscribeButton';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Menú de Navegación */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                LegalIA Honduras
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Crear Cuenta
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Banner de Prueba Gratuita */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3">
        <p className="text-center text-sm">
          ¡Prueba gratuita por 7 días! Sin compromiso, accede a todas las funciones premium.
        </p>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            Asistente Legal Inteligente
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Obtén respuestas instantáneas sobre leyes y normativas hondureñas con el poder de la Inteligencia Artificial
          </p>
        </div>

        {/* Características Principales */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-blue-600 mb-4">
              {/* Icono */}
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Respuestas Precisas
            </h3>
            <p className="text-gray-600">
              Obtén información legal precisa y actualizada en segundos sobre la legislación hondureña.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-blue-600 mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Disponibilidad 24/7
            </h3>
            <p className="text-gray-600">
              Accede a consultas legales en cualquier momento, desde cualquier lugar.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-blue-600 mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Siempre Actualizado
            </h3>
            <p className="text-gray-600">
              Base de datos actualizada con las últimas modificaciones legales.
            </p>
          </div>
        </div>

        {/* Planes de Suscripción */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Planes de Suscripción
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan Mensual */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900">Plan Mensual</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-bold text-blue-600">$20</span>
                <span className="ml-2 text-gray-600">/mes</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">Consultas ilimitadas</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">Soporte prioritario</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">Acceso a todas las funciones</span>
                </li>
              </ul>
              <SubscribeButton 
                priceId={process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!}
                planType="monthly"
                className="mt-8"
              />
            </div>

            {/* Plan Anual */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-500 relative">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <div className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                  Recomendado
                </div>
              </div>
              <div className="inline-block bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full mb-4">
                Ahorra 40%
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Plan Anual</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-bold text-blue-600">$100</span>
                <span className="ml-2 text-gray-600">/año</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">Todo lo del plan mensual</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">2 meses gratis</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">Acceso a contenido premium</span>
                </li>
              </ul>
              <SubscribeButton 
                priceId={process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!}
                planType="yearly"
                className="mt-8"
              />
            </div>
          </div>
        </div>

        {/* Sección de Garantía */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Prueba sin riesgo - 7 días de garantía de devolución de dinero
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 mt-24">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Producto</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-gray-900">Características</a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-600 hover:text-gray-900">Precios</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Soporte</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Ayuda</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Contacto</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Privacidad</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Términos</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Empresa</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Sobre nosotros</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Blog</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 LegalIA Honduras. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
