// src/components/ChatSection.tsx
'use client';

import { useRef, useEffect, useState } from 'react';

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
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    const chatEnd = chatEndRef.current;
    if (chatEnd) {
      chatEnd.scrollIntoView({ behavior: 'smooth' });
      setIsAtBottom(chatEnd.scrollTop + chatEnd.clientHeight === chatEnd.scrollHeight);
    }
  }, [messages]);

  // Rest of the component remains the same...
}
