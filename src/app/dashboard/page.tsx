'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  subscription_status: 'trial' | 'active' | 'inactive';
  subscription_tier?: 'monthly' | 'yearly' | null;
  trial_end?: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Obtener el perfil del usuario
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    setSending(true);
    setChatHistory(prev => [...prev, { role: 'user', content: query }]);

    try {
      // Aquí irá la integración con el backend de IA
      // Por ahora, simulamos una respuesta
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: 'Esta es una respuesta de prueba. Aquí se integrará la IA con las respuestas legales.'
        }]);
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
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">LegalIA</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{profile?.full_name}</span>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900"
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
          <div className="md:col-span-1 space-y-6">
            {/* Usuario y Plan */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900">Tu Plan</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>Estado: {profile?.subscription_status === 'trial' ? 'Prueba gratuita' : 'Activo'}</p>
                <p>Plan: {profile?.subscription_tier || 'No suscrito'}</p>
                {profile?.trial_end && (
                  <p>Prueba expira: {new Date(profile.trial_end).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900">Estadísticas</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>Consultas realizadas: 0</p>
                <p>Documentos generados: 0</p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
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
                    placeholder="Escribe tu consulta legal aquí..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendQuery}
                    disabled={sending || !query.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}