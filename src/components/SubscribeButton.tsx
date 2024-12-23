'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/supabase';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscribeButtonProps {
  priceId: string;
  tier: 'monthly' | 'yearly';
}

export default function SubscribeButton({ priceId, tier }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      // Verificar si el usuario está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Si no está autenticado, redirigir al login
        window.location.href = '/login';
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

      const { sessionId } = await response.json();

      // Redirigir a Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`block w-full rounded-md bg-blue-600 px-6 py-3 text-center text-white transition hover:bg-blue-700 ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? 'Procesando...' : `Suscribirse ${tier === 'yearly' ? 'anual' : 'mensual'}`}
    </button>
  );
}