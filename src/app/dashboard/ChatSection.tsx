// src/components/ChatSection.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

interface ChatSectionProps {
  profile: UserProfile;
  messages: Message[];
  isTyping: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  subscriptionStatus: string;
  trialEnd?: string;
}

export default function ChatSection({
  profile,
  messages,
  isTyping,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  subscriptionStatus
}: ChatSectionProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (isAtBottom && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  // Rest of the component remains the same...
}
