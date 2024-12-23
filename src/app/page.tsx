export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Menú de Navegación */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">LegalIA Honduras</h1>
            </div>
            <div className="flex space-x-4">
              <a
                href="/login"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Iniciar Sesión
              </a>
              <a
                href="/register"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Crear Cuenta
              </a>
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

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Asistente Legal Inteligente
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Obtén respuestas instantáneas sobre leyes y normativas hondureñas
          </p>
        </div>

        {/* Características */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Respuestas Precisas
            </h3>
            <p className="text-gray-600">
              Obtén información legal precisa y actualizada en segundos sobre la legislación hondureña.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Disponibilidad 24/7
            </h3>
            <p className="text-gray-600">
              Accede a consultas legales en cualquier momento, desde cualquier lugar.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Siempre Actualizado
            </h3>
            <p className="text-gray-600">
              Base de datos actualizada con las últimas modificaciones legales.
            </p>
          </div>
        </div>

        {/* Planes de Suscripción */}
        <div className="mt-20">
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
              </ul>
              <a
                href="/register"
                className="mt-8 block w-full text-center bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
              >
                Comenzar
              </a>
            </div>

            {/* Plan Anual */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-500">
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
              </ul>
              <a
                href="/register"
                className="mt-8 block w-full text-center bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
              >
                Suscribirse
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
