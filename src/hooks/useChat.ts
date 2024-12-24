import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  conversation_id: string;
  created_at?: string;
}

export const useChat = (conversationId: string, showWelcomePopup: boolean) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (messages.length === 0 && !showWelcomePopup) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: '¡Bienvenido de nuevo! ¿En qué puedo ayudarte hoy?',
        conversation_id: conversationId,
        created_at: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      saveMessage(welcomeMessage);
    }
  }, [messages.length, conversationId, showWelcomePopup]);

  const saveMessage = async (message: Message) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('chat_history')
        .insert([{
          user_id: user.id,
          message: message.content,
          role: message.role,
          conversation_id: message.conversation_id,
          created_at: message.created_at
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content,
      conversation_id: conversationId,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    await saveMessage(userMessage);
    setIsTyping(true);

    try {
      // Simular respuesta del asistente
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'Esta es una respuesta simulada. Aquí se integrará la respuesta real del asistente.',
        conversation_id: conversationId,
        created_at: new Date().toISOString()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        saveMessage(assistantMessage);
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
    }
  }, [conversationId]);

  const loadChatHistory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedMessages: Message[] = data.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.message,
          conversation_id: msg.conversation_id,
          created_at: msg.created_at
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, [conversationId]);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  return {
    messages,
    sendMessage,
    isTyping,
    currentMessage,
    loadChatHistory
  };
};
