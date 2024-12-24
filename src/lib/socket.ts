import { Server } from 'socket.io';

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('send_message', async (data) => {
      // Emitir "typing" mientras se procesa
      socket.emit('assistant_typing', true);

      try {
        // Aquí llamaremos a n8n webhook
        const response = await fetch(process.env.N8N_WEBHOOK_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        // Simular streaming de respuesta
        const words = result.response.split(' ');
        let message = '';

        for (const word of words) {
          message += word + ' ';
          socket.emit('receive_message_stream', {
            content: message.trim(),
            isComplete: false
          });
          await new Promise(resolve => setTimeout(resolve, 50)); // Pequeña pausa entre palabras
        }

        // Emitir mensaje completo
        socket.emit('receive_message_stream', {
          content: result.response,
          isComplete: true
        });
      } catch (error) {
        console.error('Error:', error);
        socket.emit('error', 'Error procesando tu mensaje');
      } finally {
        socket.emit('assistant_typing', false);
      }
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO no inicializado');
  }
  return io;
};