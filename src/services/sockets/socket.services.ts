import { io, Socket } from 'socket.io-client';

export class SocketService {
  socket: Socket;
  constructor() {
    this.socket = io(import.meta.env.VITE_BASE_URL, {
      transports: ['websocket'],
      secure: true
    });
  }

  // start connection
  setupSocketConnection() {
    this.socketConnectionEvents();
  }
  // listen for events
  socketConnectionEvents() {
    this.socket.on('connect', () => {
      console.log('connected = ', this.socket.id);
    });

    this.socket.on('disconnect', (reason: Socket.DisconnectReason) => {
      console.log(`Reason: ${reason}`);
      this.socket.connect();
    });

    this.socket.on('connect_error', (error) => {
      console.log(`Error: ${error}`);
      this.socket.connect();
    });
  }

  // @@@@@
  // @@@@@ Emitter
  // @@@@@
}

export const socketService: SocketService = new SocketService();
