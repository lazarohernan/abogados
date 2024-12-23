'use client';

import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';

interface WelcomePopupProps {
  userName: string;
  subscriptionStatus: 'trial' | 'active' | 'inactive';
  trialEnd?: string | null;
  onClose: () => void;
}

export default function WelcomePopup({ 
  userName, 
  subscriptionStatus, 
  trialEnd, 
  onClose 
}: WelcomePopupProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusMessage = () => {
    switch (subscriptionStatus) {
      case 'trial':
        return `Tu período de prueba gratuita vence el ${formatDate(trialEnd)}`;
      case 'active':
        return 'Tu suscripción está activa';
      default:
        return 'Por favor, actualiza tu suscripción para continuar';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className={`bg-white rounded-2xl p-8 max-w-xl w-full mx-4 transform transition-all duration-500 ease-out
          ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}
      >
        {/* Confeti decorativo */}
        <div className="absolute -top-4 -left-4 w-16 h-16">
          <div className="absolute w-4 h-4 bg-blue-500 rotate-45 transform origin-center animate-bounce"></div>
          <div className="absolute w-4 h-4 bg-yellow-500 rotate-12 transform origin-center animate-bounce delay-100"></div>
        </div>
        <div className="absolute -top-4 -right-4 w-16 h-16">
          <div className="absolute w-4 h-4 bg-green-500 -rotate-45 transform origin-center animate-bounce"></div>
          <div className="absolute w-4 h-4 bg-red-500 -rotate-12 transform origin-center animate-bounce delay-100"></div>
        </div>

        {/* Contenido */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a LegalIA, {userName}! 👋
          </h2>
          <div className="h-1 w-32 bg-blue-600 mx-auto mb-6"></div>
          
          <p className="text-lg text-gray-600 mb-6">
            Estamos emocionados de tenerte aquí. Tu asistente legal de IA está listo para ayudarte
            con todas tus consultas legales.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">
              Estado de tu cuenta: {getStatusMessage()}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-gray-900">Características disponibles:</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-center text-gray-700">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Consultas ilimitadas sobre leyes hondureñas
              </li>
              <li className="flex items-center justify-center text-gray-700">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Respuestas instantáneas y precisas
              </li>
              <li className="flex items-center justify-center text-gray-700">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Soporte 24/7
              </li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors transform hover:scale-105 duration-200"
          >
            ¡Empezar ahora!
          </button>
        </div>
      </div>
    </div>
  );
}