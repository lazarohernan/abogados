import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { priceId, userId, customerEmail, planType } = await req.json();
    
    console.log('Datos de checkout:', {
      priceId,
      userId,
      customerEmail,
      planType
    });

    // Validaciones
    if (!priceId || !priceId.startsWith('price_')) {
      return NextResponse.json(
        { error: 'ID de precio inválido' },
        { status: 400 }
      );
    }

    if (!userId || !customerEmail) {
      return NextResponse.json(
        { error: 'Faltan datos de usuario' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}?canceled=true`,
      metadata: {
        userId,
        planType,
      },
      customer_email: customerEmail,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId,
          planType,
        },
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error en create-checkout-session:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error del servidor',
        details: error
      },
      { status: 500 }
    );
  }
}
