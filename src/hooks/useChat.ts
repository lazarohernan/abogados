import { useState, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { supabase } from '@/lib/supabase';

const N8N_WEBHOOK_URL = 'https://n8n-plataforma-n8n.zycucb.easypanel.host/webhook/f7aa295e-d35e-441b-80aa-5982d7b9430e';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  conversation_id: string;
  created_at?: string;
}

export const useChat = (conversationId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: '¡Bienvenido a LegalIA! Soy tu asistente legal especializado en leyes hondureñas. Estoy aquí para ayudarte con cualquier consulta sobre legislación, procedimientos legales y normativas vigentes en Honduras. ¿En qué puedo ayudarte hoy?',
        conversation_id: conversationId,
        created_at: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      saveMessage(welcomeMessage);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('assistant_typing', (typing: boolean) => {
      setIsTyping(typing);
    });

    socket.on('receive_message_stream', ({ content, isComplete }: { content: string; isComplete: boolean }) => {
      setCurrentMessage(content);
      if (isComplete) {
        const newMessage: Message = {
          role: 'assistant',
          content,
          conversation_id: conversationId,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMessage]);
        setCurrentMessage('');
        saveMessage(newMessage);
      }
    });

    socket.on('error', (error: string) => {
      console.error('Socket error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.',
        conversation_id: conversationId,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      saveMessage(errorMessage);
    });

    return () => {
      socket.off('assistant_typing');
      socket.off('receive_message_stream');
      socket.off('error');
    };
  }, [socket, conversationId]);

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

  const sendMessage = useCallback((content: string) => {
    if (!socket || !content.trim()) return;

    const message: Message = {
      role: 'user',
      content,
      conversation_id: conversationId,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    saveMessage(message);
    
    socket.emit('send_message', {
      ...message,
      webhook_url: N8N_WEBHOOK_URL
    });
  }, [socket, conversationId]);

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
