
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://barbershop-backend-jgst.onrender.com';

console.log(`Intentando conectar a: ${SOCKET_SERVER_URL}`);

const socket = io(SOCKET_SERVER_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});



export default socket;