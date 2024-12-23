export default function Home() {
  return (
    <div className="bg-white">
      {/* Banner de Prueba Gratuita */}
      <div className="w-full bg-blue-600 p-3">
        <p className="text-center text-sm text-white">
          ¡Prueba gratuita por 7 días! Sin compromiso, accede a todas las funciones premium.
        </p>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            LegalIA Honduras
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Asistente legal impulsado por Inteligencia Artificial
          </p>
        </div>

        {/* Planes de Precios */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Plan Mensual */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Plan Mensual</h2>
            <p className="mt-4 text-5xl font-bold tracking-tight text-gray-900">$20</p>
            <p className="mt-2 text-base text-gray-500">/mes</p>
            <button className="mt-8 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Suscribirse Mensual
            </button>
          </div>

          {/* Plan Anual */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Plan Anual</h2>
            <p className="mt-4 text-5xl font-bold tracking-tight text-gray-900">$100</p>
            <p className="mt-2 text-base text-gray-500">/año</p>
            <button className="mt-8 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Suscribirse Anual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
