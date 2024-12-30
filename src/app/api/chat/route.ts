import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 10;
const MESSAGE_LIMIT_TRIAL = 10;

// Rate limiting storage (in memory - consider using Redis in production)
const rateLimits = new Map<string, { count: number; timestamp: number }>();

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get session
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) throw authError;
    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status, trial_end')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw profileError;
    if (!profile) {
      return NextResponse.json(
        { error: 'Perfil no encontrado' },
        { status: 404 }
      );
    }

    // Check subscription status
    if (profile.subscription_status === 'inactive') {
      return NextResponse.json(
        { error: 'Suscripción inactiva' },
        { status: 403 }
      );
    }

    // Check trial status and limits
    if (profile.subscription_status === 'trial') {
      const trialEnd = profile.trial_end ? new Date(profile.trial_end) : null;
      if (trialEnd && trialEnd < new Date()) {
        return NextResponse.json(
          { error: 'Periodo de prueba expirado' },
          { status: 403 }
        );
      }

      // Check message count for trial users
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      if (typeof count === 'number' && count >= MESSAGE_LIMIT_TRIAL) {
        return NextResponse.json(
          { error: 'Límite de mensajes alcanzado en periodo de prueba' },
          { status: 403 }
        );
      }
    }

    // Check rate limits
    const userId = session.user.id;
    const now = Date.now();
    const userRateLimit = rateLimits.get(userId);

    if (userRateLimit) {
      if (now - userRateLimit.timestamp < RATE_LIMIT_WINDOW) {
        if (userRateLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
          return NextResponse.json(
            { error: 'Límite de solicitudes excedido' },
            { status: 429 }
          );
        }
        userRateLimit.count++;
      } else {
        rateLimits.set(userId, { count: 1, timestamp: now });
      }
    } else {
      rateLimits.set(userId, { count: 1, timestamp: now });
    }

    // Get message from request
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      );
    }

    // TODO: Integrate with your AI service here
    // For now, return a mock response
    const response = {
      message: `Respuesta de prueba al mensaje: ${message}`,
      timestamp: new Date().toISOString()
    };

    // Save message to database
    const { error: saveError } = await supabase
      .from('messages')
      .insert([
        {
          user_id: session.user.id,
          content: message,
          role: 'user'
        },
        {
          user_id: session.user.id,
          content: response.message,
          role: 'assistant'
        }
      ]);

    if (saveError) throw saveError;

    return NextResponse.json(response);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error del servidor',
        details: error
      },
      { status: 500 }
    );
  }
}