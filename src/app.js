import express from 'express';
import initSocket from './init/socket.js';
import { createServer } from 'http';
import { loadGameAssets } from './init/assets.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server); // 소켓 서버 초기화

app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    //server가 시동이 된 다음 파일 읽음
    try {
        const assets = await loadGameAssets();
        console.log('Assets loaded successfully');
    } catch (error) {
        console.error('Failed to load game assets:', error);
    }
});
