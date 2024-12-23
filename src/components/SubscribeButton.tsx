'use client';

import { useState, useEffect } from 'react';
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

  // Debug log para ver el priceId cuando el componente se monta
  useEffect(() => {
    console.log('SubscribeButton montado con:', {
      priceId,
      planType,
      isValidFormat: priceId?.startsWith('price_')
    });
  }, [priceId, planType]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      // Debug log antes de la validación
      console.log('Iniciando proceso de suscripción:', {
        priceId,
        planType,
        stripeKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      });

      // Validación del priceId
      if (!priceId || !priceId.startsWith('price_')) {
        throw new Error(`ID de precio inválido: ${priceId}`);
      }

      // Verificar autenticación
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la sesión de checkout');
      }

      // Redireccionar a Stripe
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Error al cargar Stripe');

      await stripe.redirectToCheckout({ sessionId: data.sessionId });

    } catch (error) {
      console.error('Error completo:', error);
      alert(error instanceof Error ? error.message : 'Error al procesar la suscripción');
    } finally {
      setLoading(false);
    }
  };

  // Si el priceId no es válido, mostrar un botón deshabilitado con mensaje
  if (!priceId?.startsWith('price_')) {
    console.warn('Price ID inválido:', priceId);
    return (
      <button
        disabled
        className={`w-full px-6 py-3 text-white bg-gray-400 rounded-md ${className}`}
      >
        Configuración pendiente
      </button>
    );
  }

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
