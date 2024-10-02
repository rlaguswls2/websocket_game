// 서버가 실행될 때 항상 호출되어 시행된다.
import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

const initSocket = (server) => {
    const io = new SocketIO();
    io.attach(server);
    registerHandler(io);
};

export default initSocket;
