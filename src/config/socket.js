import { io } from 'socket.io-client';

const socket = io('https://barbershop-backend-jgst.onrender.com/api', {
  withCredentials: true,
});

export default socket;
