'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import useChat from '@/hooks/useChat';
import DashboardLayout from './DashboardLayout';
import ChatSection from './ChatSection';
import WelcomePopup from '@/components/WelcomePopup';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, error: authError } = useAuth();
  const {
    messages,
    isTyping,
    inputMessage,
    setInputMessage,
    sendMessage,
    error: chatError,
    clearError,
  } = useChat();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile?.subscription_status === 'inactive') {
      const trialEnd = profile.trial_end ? new Date(profile.trial_end) : null;
      const isTrialExpired = trialEnd ? trialEnd < new Date() : true;

      if (isTrialExpired) {
        router.push('/dashboard/subscription');
      }
    }
  }, [profile, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-xl font-semibold text-center mb-2 text-red-600">
            Error de autenticación
          </h3>
          <p className="text-gray-600 text-center mb-6">{authError.message}</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <DashboardLayout profile={profile}>
      <WelcomePopup />
      <ChatSection
        profile={profile}
        messages={messages}
        isTyping={isTyping}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={() => sendMessage(inputMessage)}
      />
    </DashboardLayout>
  );
}
