// 서버가 실행될 때 항상 호출되어 시행된다.
import { Server as SocketIO } from 'socket.io';

const initSocket = (server) => {
    const io = new SocketIO();

    io.attach(server);
};

export default initSocket;
