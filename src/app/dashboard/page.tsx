'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { storage } from '@/lib/storage';
import WelcomePopup from '@/components/WelcomePopup';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  subscription_status: 'trial' | 'active' | 'inactive';
  subscription_tier?: 'monthly' | 'yearly' | null;
  trial_end?: string | null;
}

interface ChatMessage {
  id?: string;
  role: string;
  content: string;
  conversation_id: string;
  created_at?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);

  useEffect(() => {
    checkUser();
    // Generar un nuevo ID de conversación
    setConversationId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    if (profile) {
      loadChatHistory();
      checkSubscriptionStatus();
    }
  }, [profile]);

  const checkSubscriptionStatus = () => {
    if (!profile) return true;

    if (profile.subscription_status === 'active') {
      return false; // No expirado si está activo
    }

    if (profile.subscription_status === 'trial' && profile.trial_end) {
      const trialEndDate = new Date(profile.trial_end);
      const isExpired = new Date() > trialEndDate;
      setSubscriptionExpired(isExpired);
      return isExpired;
    }

    setSubscriptionExpired(true);
    return true; // Expirado por defecto
  };

  const loadChatHistory = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', profile.id)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        setChatHistory(data.map(msg => ({
          role: msg.role,
          content: msg.content,
          conversation_id: msg.conversation_id,
          created_at: msg.created_at
        })));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatMessage = async (message: ChatMessage) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('chat_history')
        .insert([
          {
            user_id: profile.id,
            message: message.content,
            role: message.role,
            conversation_id: message.conversation_id
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(profile);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuery = async () => {
    if (!query.trim() || sending || checkSubscriptionStatus()) return;

    setSending(true);
    const userMessage = {
      role: 'user',
      content: query,
      conversation_id: conversationId
    };

    setChatHistory(prev => [...prev, userMessage]);
    await saveChatMessage(userMessage);

    try {
      // Aquí irá la integración con el backend de IA
      // Por ahora, simulamos una respuesta
      setTimeout(async () => {
        const assistantMessage = {
          role: 'assistant',
          content: 'Esta es una respuesta de prueba. Aquí se integrará la IA con las respuestas legales.',
          conversation_id: conversationId
        };
        
        setChatHistory(prev => [...prev, assistantMessage]);
        await saveChatMessage(assistantMessage);
        
        setQuery('');
        setSending(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... Navbar y estructura principal igual ... */}

      {/* Chat Area */}
      <div className="md:col-span-3">
        <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
          {subscriptionExpired ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-red-600 text-xl font-semibold mb-4">
                  Tu período de prueba ha terminado
                </div>
                <p className="text-gray-600 mb-6">
                  Para continuar usando LegalIA, por favor actualiza tu suscripción.
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver planes de suscripción
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Chat History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3/4 p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendQuery();
                      }
                    }}
                    placeholder="Escribe tu consulta legal aquí..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={subscriptionExpired}
                  />
                  <button
                    onClick={handleSendQuery}
                    disabled={sending || !query.trim() || subscriptionExpired}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Welcome Popup */}
      {showWelcome && profile && (
        <WelcomePopup
          userName={profile.full_name}
          subscriptionStatus={profile.subscription_status}
          trialEnd={profile.trial_end}
          onClose={handleCloseWelcome}
        />
      )}
    </div>
  );
}
