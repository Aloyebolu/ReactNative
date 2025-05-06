// socket.ts
import { host2 } from '@/constants/Env';
import { io, Socket } from 'socket.io-client';
import emitter from "@/app/utils/eventEmitter";

let socket: Socket | null = null;

export const initiateSocket = (userId: string) => {
  if (!socket) {
    socket = io(`http://${host2}`, {
      query: { user_id: userId },
      transports: ['websocket']
    });

    socket.on('connect', () => {
      console.log('🔌 Connected globally');
      emitter.emit('connected')
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected globally');
      emitter.emit("disconnected")
    });

    socket.on('db_update', (payload) => {
      console.log('🔔 Global db_update received:');
      emitter.emit('db_update', payload); 
    });
    socket.on('get_unread_conversations', (payload) => {
      console.log('🔔 Global unread_messages received:');
      emitter.emit('get_unread_conversations', payload); 
    });
    
  }
};

export const getSocket = () => socket;
export const closeSocket = () => {
  socket?.disconnect();
  socket = null;
};
