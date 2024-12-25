import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
  conversation_id: string;
}

export default function useChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Cargar mensajes anteriores
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) {
          setMessages(data);
        }
      } catch (err) {
        console.error('Error loading messages:', err);
        setError('Error al cargar los mensajes');
      }
    };

    loadMessages();
  }, [conversationId]);

  // Configurar WebSocket
  useEffect(() => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001');

    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'typing') {
        setIsTyping(data.isTyping);
      } else if (data.type === 'message_stream') {
        setCurrentMessage(data.content);
        if (data.isComplete) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: data.content,
            conversation_id: conversationId,
            created_at: new Date().toISOString()
          }]);
          setCurrentMessage('');
          saveMessage({
            role: 'assistant',
            content: data.content,
            conversation_id: conversationId
          });
        }
      }
    };

    socket.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('Error en la conexión');
    };

    return () => {
      socket.close();
    };
  }, [conversationId]);

  const saveMessage = async (message: Message) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          ...message,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (err) {
      console.error('Error saving message:', err);
      setError('Error al guardar el mensaje');
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const newMessage = {
      role: 'user' as const,
      content,
      conversation_id: conversationId,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    await saveMessage(newMessage);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationId
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error al enviar el mensaje');
    }
  }, [conversationId]);

  return {
    messages,
    sendMessage,
    isTyping,
    currentMessage,
    error,
  };
}
