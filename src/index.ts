import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "https://chat-platform-tau.vercel.app",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('send_message', async (data) => {
    try {
      socket.emit('assistant_typing', true);

      const response = await fetch(data.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      socket.emit('receive_message_stream', {
        content: result.response,
        isComplete: true
      });
    } catch (error) {
      socket.emit('error', 'Error procesando mensaje');
    } finally {
      socket.emit('assistant_typing', false);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});