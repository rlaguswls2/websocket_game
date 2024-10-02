import { CLIENT_VERSION } from '../constants.js';
import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';
import { removeUser } from '../models/user.model.js';

export const handleDisconnect = (socket) => {
    removeUser(socket.id);
    console.log(`User disconnected: ${socket.id}`);
    console.log(`Current users:`, getUsers());
};

// 서버 연결시 처리할 기능들을 모아둔 함수
export const handleConnection = (socket, uuid) => {
    console.log('New use connected!:', uuid, 'with socket ID:', socket.id);
    console.log('Current users:', getUsers());

    // 본인의 소켓의 connection 이벤트에게 uuid를 보냄
    socket.emit('connection', { uuid });
};

export const handlerEvent = (io, socket, data) => {
    // 받은 클라이언트 버전이 서버의 클라이언트 버전 관리 중에 없다면 fail
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
        return;
    }

    // 핸들러 매핑
    const handler = handlerMappings[data.handlerId];
    if (!handler) {
        socket.emit('response', { status: 'fail', message: 'Handler not found' });
        return;
    }

    const response = handler(data.userId, data.payload); // 핸들러 번호, 핸들러 이름 등록

    // broadcast 해야할 내용이라면
    if (response.broadcast) {
        io.emit('response', 'broadcast');
        return;
    }
    // 아니라면 그냥 한명의 유저에게 전달
    socket.emit('response', response);
};
