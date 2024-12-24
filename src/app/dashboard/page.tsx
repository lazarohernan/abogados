'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { storage } from '@/lib/storage';
import WelcomePopup from '@/components/WelcomePopup';
import { useChat } from '@/hooks/useChat';

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
  const [showWelcome, setShowWelcome] = useState(false);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, isTyping, currentMessage } = useChat(conversationId);

  useEffect(() => {
    checkUser();
    const hasVisited = storage.get('hasVisitedDashboard');
    if (!hasVisited) {
      setShowWelcome(true);
      storage.set('hasVisitedDashboard', 'true');
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentMessage]);

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
      checkSubscriptionStatus(profile);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = (profile: UserProfile) => {
    if (profile.subscription_status === 'active') {
      setSubscriptionExpired(false);
      return;
    }

    if (profile.subscription_status === 'trial' && profile.trial_end) {
      const trialEndDate = new Date(profile.trial_end);
      setSubscriptionExpired(new Date() > trialEndDate);
    } else {
      setSubscriptionExpired(true);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isTyping) return;
    sendMessage(inputMessage);
    setInputMessage('');
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
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                LegalIA
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {profile && (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{profile.full_name}</div>
                    <div className="text-xs text-gray-500">{profile.email}</div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Perfil y Plan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tu Plan</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Estado</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${profile?.subscription_status === 'trial' ? 'bg-yellow-100 text-yellow-800' : 
                      profile?.subscription_status === 'active' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {profile?.subscription_status === 'trial' ? 'Prueba' : 
                     profile?.subscription_status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                {profile?.subscription_status === 'trial' && profile?.trial_end && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Expira</span>
                    <span className="text-sm text-gray-900">
                      {new Date(profile.trial_end).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {profile?.subscription_tier && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Plan</span>
                    <span className="text-sm text-gray-900 capitalize">
                      {profile.subscription_tier}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Consultas</span>
                    <span className="text-sm font-medium text-gray-900">
                      {messages.filter(m => m.role === 'user').length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(messages.filter(m => m.role === 'user').length * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-12rem)]">
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
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Ver planes de suscripción
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-gray-500">
                            <p>Comienza una conversación haciendo una consulta legal</p>
                          </div>
                        </div>
                      ) : (
                        messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {message.role === 'assistant' && (
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                <span className="text-sm font-medium text-blue-600">AI</span>
                              </div>
                            )}
                            <div
                              className={`max-w-[75%] px-4 py-2 rounded-lg ${
                                message.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))
                      )}
                      {isTyping && (
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <span className="text-sm font-medium text-blue-600">AI</span>
                          </div>
                          <div className="bg-gray-100 rounded-lg px-4 py-2">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      {currentMessage && (
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <span className="text-sm font-medium text-blue-600">AI</span>
                          </div>
                          <div className="bg-gray-100 rounded-lg px-4 py-2">
                            {currentMessage}
                          </div>
                        </div>
                      )}
                    </div>
                    <div ref={chatEndRef} />
                  </div>

                  <div className="border-t p-4">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Escribe tu consulta legal aquí..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isTyping}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isTyping ? 'Procesando...' : 'Enviar'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
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
