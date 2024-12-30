// src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export default function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isTyping) return;

    const newMessage = {
      role: 'user',
      content: message,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        created_at: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping]);

  return {
    messages,
    isTyping,
    inputMessage,
    setInputMessage,
    sendMessage
  };
}
