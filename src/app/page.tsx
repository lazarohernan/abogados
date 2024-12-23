import SubscribeButton from '@/components/SubscribeButton';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-blue-50 to-white">
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
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">
            LegalIA Honduras
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Asistente legal impulsado por Inteligencia Artificial, especializado en leyes hondureñas. 
            Obtenga respuestas instantáneas y precisas para sus consultas legales.
          </p>
        </div>

        {/* Ejemplos de Consultas */}
        <div className="my-12">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Tipos de Consultas Legales
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-lg font-semibold text-blue-600">Derecho Civil</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Procesos de divorcio y familia</li>
                <li>• Contratos civiles y mercantiles</li>
                <li>• Derecho sucesorio y testamentos</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-lg font-semibold text-blue-600">Derecho Penal</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Interpretación del Código Penal</li>
                <li>• Procedimientos penales</li>
                <li>• Recursos de apelación</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-lg font-semibold text-blue-600">Derecho Laboral</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Derechos y obligaciones laborales</li>
                <li>• Cálculo de prestaciones</li>
                <li>• Procedimientos ante la STSS</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-lg font-semibold text-blue-600">Derecho Administrativo</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Trámites gubernamentales</li>
                <li>• Permisos y licencias</li>
                <li>• Recursos administrativos</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-lg font-semibold text-blue-600">Derecho Mercantil</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Constitución de sociedades</li>
                <li>• Regulaciones comerciales</li>
                <li>• Propiedad intelectual</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-lg font-semibold text-blue-600">Derecho Tributario</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Obligaciones fiscales</li>
                <li>• Exenciones tributarias</li>
                <li>• Procedimientos ante el SAR</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="my-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-3 text-xl font-semibold text-gray-900">Respuestas Instantáneas</h3>
            <p className="text-gray-600">Obtenga información legal precisa y actualizada en segundos</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-3 text-xl font-semibold text-gray-900">Leyes Hondureñas</h3>
            <p className="text-gray-600">Base de datos completa de la legislación de Honduras</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-3 text-xl font-semibold text-gray-900">Disponibilidad 24/7</h3>
            <p className="text-gray-600">Acceso ilimitado a consultas legales en cualquier momento</p>
          </div>
        </div>

        {/* Testimonios */}
        <div className="my-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Lo que dicen nuestros usuarios
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">JR</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Juan Rodríguez</h4>
                  <p className="text-sm text-gray-600">Abogado Corporativo</p>
                </div>
              </div>
              <p className="text-gray-600">
                "La precisión y rapidez de las respuestas me han ayudado a optimizar mi trabajo diario. Una herramienta indispensable."
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">MP</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">María Paz</h4>
                  <p className="text-sm text-gray-600">Asesora Legal</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Excelente herramienta para mantenerse actualizado con la legislación hondureña. El soporte es excepcional."
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">CF</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Carlos Flores</h4>
                  <p className="text-sm text-gray-600">Notario Público</p>
                </div>
              </div>
              <p className="text-gray-600">
                "La IA ha demostrado ser muy precisa en sus respuestas sobre procedimientos notariales. Altamente recomendado."
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="my-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Planes de Suscripción</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Plan Mensual */}
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Plan Mensual</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600">$20</span>
                <span className="text-gray-600">/mes</span>
              </div>
              <ul className="mb-6 space-y-3">
                <li className="flex items-center text-gray-600">
                  <svg className="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Consultas ilimitadas
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Acceso 24/7
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Soporte prioritario
                </li>
              </ul>
              <SubscribeButton 
                priceId={process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!}
                tier="monthly" 
              />
            </div>

            {/* Plan Anual */}
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <div className="mb-4 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600 inline-block">
                Ahorra 40%
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Plan Anual</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600">$100</span>
                <span className="text-gray-600">/año</span>
              </div>
              <ul className="mb-6 space-y-3">
                <li className="flex items-center text-gray-600">
                  <svg className="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Todo lo del plan mensual
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  2 meses gratis
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Acceso a contenido premium
                </li>
              </ul>
              <SubscribeButton 
                priceId={process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!}
                tier="yearly" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}