'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/supabase';

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

      // Validar el price ID
      if (!priceId || !priceId.startsWith('price_')) {
        console.error('Invalid price ID:', priceId);
        throw new Error('ID de precio inválido');
      }

      console.log('Price ID:', priceId);
      console.log('Plan Type:', planType);

      // Verificar si el usuario está autenticado
      const { data: { user } } = await supabase.auth.getUser();

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
          planType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la sesión de checkout');
      }

      const { sessionId } = await response.json();

      // Redirigir a Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Error al cargar Stripe');

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) {
        throw stripeError;
      }

    } catch (error) {
      console.error('Error detallado:', error);
      alert(error instanceof Error ? error.message : 'Error al procesar la suscripción');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar un mensaje de error si el price ID no es válido
  if (!priceId || !priceId.startsWith('price_')) {
    return (
      <button
        disabled
        className={`w-full px-6 py-3 text-white bg-red-600 rounded-md ${className}`}
      >
        Error: ID de precio no válido
      </button>
    );
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? 'Procesando...' : `Suscribirse al plan ${planType === 'monthly' ? 'mensual' : 'anual'}`}
    </button>
  );
}
