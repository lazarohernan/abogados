'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/supabase';

// Inicializar Stripe
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

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      // Verificar si el usuario está autenticado
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Si no está autenticado, redirigir al login
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

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Redirigir a Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Error cargando Stripe');

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) {
        throw stripeError;
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la suscripción. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        'Procesando...'
      ) : (
        `Suscribirse al plan ${planType === 'monthly' ? 'mensual' : 'anual'}`
      )}
    </button>
  );
}
