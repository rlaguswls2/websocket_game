import { CLIENT_VERSION } from './constant.js';

let userId = '';
let scoreInstance = null;

const socket = io('http://localhost:3000', {
    query: {
        clientVersion: CLIENT_VERSION,
        userId,
    },
});

socket.on('response', (data) => {
    console.log(data);
});

socket.on('connection', (data) => {
    console.log('connection: ', data);
    userId = data.uuid;
});

const sendEvent = (handlerId, payload) => {
    socket.emit('event', {
        userId,
        clientVersion: CLIENT_VERSION,
        handlerId,
        payload,
    });
};

const setScoreInstance = (instance) => {
    scoreInstance = instance;
};

export { sendEvent, setScoreInstance };
