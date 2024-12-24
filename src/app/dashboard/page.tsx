'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { storage } from '@/lib/storage';
import WelcomePopup from '@/components/WelcomePopup';
import { useChat } from '@/hooks/useChat';

// ... (interfaces previas)

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasVisited = storage.get('hasVisitedDashboard');
    setShowWelcome(!hasVisited);
    if (!hasVisited) {
      storage.set('hasVisitedDashboard', 'true');
    }
    checkUser();
  }, []);

  const { messages, sendMessage, isTyping, currentMessage } = useChat(conversationId, showWelcome);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  // ... (resto de funciones del dashboard)

  // En el JSX, asegúrate de que el WelcomePopup tenga un mensaje mejorado:
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... resto del JSX ... */}
      
      {showWelcome && profile && (
        <WelcomePopup
          userName={profile.full_name}
          subscriptionStatus={profile.subscription_status}
          trialEnd={profile.trial_end}
          onClose={handleCloseWelcome}
          message={`¡Bienvenido a LegalIA, ${profile.full_name}! 👋

Soy tu asistente legal especializado en leyes hondureñas y estoy aquí para ayudarte con:

• Consultas sobre legislación vigente
• Interpretación de leyes y normativas
• Procedimientos legales
• Trámites y requisitos

Tu período de prueba gratuito te permite explorar todas las funcionalidades premium hasta el ${new Date(profile.trial_end || '').toLocaleDateString()}.

¿Listo para comenzar?`}
        />
      )}
    </div>
  );
}
