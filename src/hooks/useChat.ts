import { useState, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { supabase } from '@/lib/supabase';

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
          conversation_id: conversationId
        };
        setMessages(prev => [...prev, newMessage]);
        setCurrentMessage('');
        saveMessage(newMessage);
      }
    });

    socket.on('error', (error: string) => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.off('assistant_typing');
      socket.off('receive_message_stream');
      socket.off('error');
    };
  }, [socket, conversationId]);

  const saveMessage = async (message: Message) => {
    try {
      const { error } = await supabase
        .from('chat_history')
        .insert([{
          user_id: (await supabase.auth.getUser()).data.user?.id,
          message: message.content,
          role: message.role,
          conversation_id: message.conversation_id
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
      conversation_id: conversationId
    };

    setMessages(prev => [...prev, message]);
    saveMessage(message);
    socket.emit('send_message', message);
  }, [socket, conversationId]);

  return {
    messages,
    sendMessage,
    isTyping,
    currentMessage
  };
};
