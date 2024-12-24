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

// Componente Sidebar
const Sidebar = ({ profile, chatHistory }: { profile: UserProfile | null; chatHistory: ChatMessage[] }) => (
  <div className="md:col-span-1 space-y-6">
    {/* Perfil del Usuario */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-xl font-bold text-blue-600">
            {profile?.full_name?.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{profile?.full_name}</h3>
          <p className="text-sm text-gray-500">{profile?.email}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Estado</span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            profile?.subscription_status === 'trial' 
              ? 'bg-yellow-100 text-yellow-800' 
              : profile?.subscription_status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {profile?.subscription_status === 'trial' 
              ? 'Prueba Gratuita' 
              : profile?.subscription_status === 'active'
              ? 'Activo'
              : 'Inactivo'}
          </span>
        </div>
        {profile?.trial_end && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Expira</span>
            <span className="text-sm font-medium">
              {new Date(profile.trial_end).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>

    {/* Estadísticas */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Estadísticas</h3>
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Consultas</span>
            <span className="text-lg font-semibold text-gray-900">
              {chatHistory.filter(msg => msg.role === 'user').length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(chatHistory.filter(msg => msg.role === 'user').length * 10, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Documentos</span>
            <span className="text-lg font-semibold text-gray-900">0</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-600 h-2.5 rounded-full w-0"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Enlaces Rápidos */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Enlaces Rápidos</h3>
      <div className="space-y-2">
        <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600 flex items-center space-x-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Documentos Recientes</span>
        </button>
        <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600 flex items-center space-x-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Nueva Consulta</span>
        </button>
        <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600 flex items-center space-x-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Configuración</span>
        </button>
      </div>
    </div>
  </div>
);

// Componente de Mensaje
const ChatMessage = ({ message }: { message: ChatMessage }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    {message.role === 'assistant' && (
      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
        <span className="text-sm font-medium text-blue-600">AI</span>
      </div>
    )}
    <div
      className={`max-w-[70%] p-4 rounded-xl ${
        message.role === 'user'
          ? 'bg-blue-600 text-white ml-2'
          : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="prose prose-sm">
        {message.content}
      </div>
      <div className="mt-1 text-xs opacity-70">
        {message.created_at && new Date(message.created_at).toLocaleTimeString()}
      </div>
    </div>
    {message.role === 'user' && (
      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ml-2">
        <span className="text-sm font-medium text-gray-600">U</span>
      </div>
    )}
  </div>
);

// Componente Principal
export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());

  const { messages, sendMessage, isTyping, currentMessage } = useChat(conversationId);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

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
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Sidebar profile={profile} chatHistory={messages} />

          {/* Chat Area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
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
                      className="
