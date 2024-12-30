'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
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
    clearError
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

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error state
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Error de autenticación</h3>
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

  // Show error toast for chat errors
  if (chatError) {
    return (
      <DashboardLayout profile={profile!} activeSection="chat">
        <div className="relative">
          {/* Error Toast */}
          <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center shadow-lg">
            <div className="mr-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">{chatError.message}</p>
            </div>
            <button
              onClick={clearError}
              className="ml-4 text-red-700 hover:text-red-800"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ChatSection
            profile={profile!}
            messages={messages}
            isTyping={isTyping}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={() => sendMessage(inputMessage)}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) return null;

  return (
    <DashboardLayout profile={profile} activeSection="chat">
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