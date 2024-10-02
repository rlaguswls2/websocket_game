import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../models/user.model.js';
import { handleConnection, handleDisconnect } from './helper.js';

const registerHandler = (io) => {
    io.on('connection', (socket) => {
        // 최초 커넥션을 맺은 이후 발생하는 이벤트를 다룸
        const userUUID = uuidv4();
        addUser({ uuid: userUUID, socketId: socket.id });
        handleConnection(socket, userUUID);

        // 접속 해제시 이벤트
        socket.on('disconnect', () => handleDisconnect(socket));
    });
};

export default registerHandler;
