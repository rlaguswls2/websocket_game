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

    // 스테이지에 정보 넣어주기, 접속하자 마자 시작
    const { stages } = getGameAssets();
    // stages 배열에서 0번째 = 첫번째 스테이지
    setStage(uuid, stages.data[0].id);
    console.log('Stage:', getStage(uuid));

    // 본인의 소켓의 connection 이벤트에게 uuid를 보냄
    socket.emit('connection', { uuid });
};
