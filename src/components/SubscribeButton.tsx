'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/supabase';

// Verificar la clave pública de Stripe
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.error('Missing Stripe publishable key');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscribeButtonProps {
  priceId: string;
  planType: 'monthly' | 'yearly';
  className?: string;
}

export default function SubscribeButton({ 
  priceId, 
  planType,
  className = ''
}: SubscribeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validar priceId
      if (!priceId) {
        throw new Error('Price ID no disponible');
      }

      // Log para debugging
      console.log('Iniciando suscripción:', {
        priceId,
        planType
      });

      // Verificar autenticación
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(`Error de autenticación: ${authError.message}`);
      }

      if (!user) {
        router.push('/login');
        return;
      }

      // Crear sesión de checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          customerEmail: user.email,
        }),
      });

      // Log de la respuesta para debugging
      console.log('Respuesta del servidor:', {
        status: response.status,
        ok: response.ok
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la sesión de checkout');
      }

      // Redireccionar a Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('No se pudo cargar Stripe');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (stripeError) {
        throw stripeError;
      }

    } catch (err) {
      console.error('Error completo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      alert(`Error al procesar la suscripción: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!priceId) {
    return (
      <button
        disabled
        className={`w-full px-6 py-3 text-white bg-gray-400 rounded-md ${className}`}
      >
        Price ID no disponible
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? 'Procesando...' : `Suscribirse al plan ${planType === 'monthly' ? 'mensual' : 'anual'}`}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
