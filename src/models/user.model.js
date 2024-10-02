const users = [];

export const addUser = (user) => {
    user.push(user);
};

export const getUsers = () => {
    return users;
};

export const removeUser = (socketId) => {
    const index = users.findIndex((user) => user.socketId === socketId);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};
