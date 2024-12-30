import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatError {
  code: string;
  message: string;
  details?: string;
}

const MESSAGE_LIMIT_TRIAL = 10;
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 10;

export default function useChat() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [error, setError] = useState<ChatError | null>(null);
  const [requestCount, setRequestCount] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState(Date.now());

  // Load messages from Supabase on mount
  useEffect(() => {
    const loadMessages = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) setMessages(data);
      } catch (err) {
        console.error('Error loading messages:', err);
        setError({
          code: 'load_error',
          message: 'Error al cargar los mensajes',
          details: err instanceof Error ? err.message : undefined
        });
      }
    };

    loadMessages();
  }, [user]);

  // Check subscription status and message limits
  const checkMessageLimits = useCallback(() => {
    if (!profile) {
      throw {
        code: 'auth_error',
        message: 'No se encontró el perfil del usuario'
      };
    }

    // Check subscription status
    if (profile.subscription_status === 'inactive') {
      throw {
        code: 'subscription_inactive',
        message: 'Tu suscripción ha expirado'
      };
    }

    // Check trial limits
    if (profile.subscription_status === 'trial') {
      const trialEnd = profile.trial_end ? new Date(profile.trial_end) : null;
      if (trialEnd && trialEnd < new Date()) {
        throw {
          code: 'trial_expired',
          message: 'Tu periodo de prueba ha terminado'
        };
      }

      if (messages.length >= MESSAGE_LIMIT_TRIAL) {
        throw {
          code: 'trial_limit_reached',
          message: 'Has alcanzado el límite de mensajes del periodo de prueba'
        };
      }
    }

    // Check rate limits
    const now = Date.now();
    if (now - lastRequestTime < RATE_LIMIT_WINDOW) {
      if (requestCount >= RATE_LIMIT_MAX_REQUESTS) {
        throw {
          code: 'rate_limit',
          message: 'Has excedido el límite de mensajes por minuto'
        };
      }
    } else {
      // Reset rate limit counter
      setRequestCount(0);
      setLastRequestTime(now);
    }
  }, [profile, messages.length, requestCount, lastRequestTime]);

  // Save message to Supabase
  const saveMessage = async (message: Message) => {
    if (!user) return;

    const { error } = await supabase
      .from('messages')
      .insert([{ ...message, user_id: user.id }]);

    if (error) throw error;
  };

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isTyping) return;

    setError(null);
    
    try {
      // Check limits before sending
      checkMessageLimits();

      // Create and save user message
      const userMessage: Message = {
        role: 'user',
        content: message.trim(),
        created_at: new Date().toISOString()
      };

      await saveMessage(userMessage);
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsTyping(true);
      setRequestCount(prev => prev + 1);

      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content })
      });

      if (!response.ok) {
        const error = await response.json();
        throw {
          code: error.code || 'api_error',
          message: error.message || 'Error en la respuesta del servidor'
        };
      }

      const data = await response.json();
      
      // Create and save assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        created_at: new Date().toISOString()
      };

      await saveMessage(assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error('Chat error:', err);
      setError(err as ChatError);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, user, checkMessageLimits]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isTyping,
    inputMessage,
    setInputMessage,
    sendMessage,
    error,
    clearError
  };
}