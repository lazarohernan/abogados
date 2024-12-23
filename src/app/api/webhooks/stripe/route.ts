import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature');

  let event;

  try {
    // Verificar la firma del webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('Webhook recibido:', event.type);

    // Manejar diferentes eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        console.log('Checkout completado:', session);

        // Obtener el ID del usuario y el tipo de plan de los metadatos
        const { userId } = session.metadata;
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const priceId = subscription.items.data[0].price.id;

        // Determinar el tipo de plan basado en el price ID
        const subscriptionTier = priceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID 
          ? 'monthly' 
          : 'yearly';

        // Actualizar el perfil del usuario en Supabase
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            stripe_customer_id: session.customer,
            subscription_status: 'active',
            subscription_tier: subscriptionTier,
            trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días de prueba
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error actualizando perfil:', updateError);
          throw updateError;
        }

        console.log('Perfil actualizado exitosamente');
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        console.log('Suscripción actualizada:', subscription);

        // Encontrar el usuario por stripe_customer_id
        const { data: profiles, error: findError } = await supabase
          .from('profiles')
          .select('*')
          .eq('stripe_customer_id', subscription.customer)
          .single();

        if (findError) {
          console.error('Error encontrando perfil:', findError);
          throw findError;
        }

        // Actualizar el estado de la suscripción
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: subscription.status,
          })
          .eq('stripe_customer_id', subscription.customer);

        if (updateError) {
          console.error('Error actualizando suscripción:', updateError);
          throw updateError;
        }

        console.log('Estado de suscripción actualizado');
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        console.log('Suscripción cancelada:', subscription);

        // Actualizar el estado del usuario a inactivo
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'inactive',
            subscription_tier: null
          })
          .eq('stripe_customer_id', subscription.customer);

        if (updateError) {
          console.error('Error actualizando estado de cancelación:', updateError);
          throw updateError;
        }

        console.log('Estado de cancelación actualizado');
        break;
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error en webhook:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error procesando webhook' }),
      { status: 400 }
    );
  }
}
