"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const ws = new ws_1.WebSocketServer({ port: 8080 });
let allUser = [];
ws.on("connection", (socket) => {
    socket.on("message", (message) => {
        var _a;
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type == "join") {
            allUser.push({
                socket,
                room: parsedMessage.payload.roomId,
                name: parsedMessage.payload.name
            });
        }
        if (parsedMessage.type == "chat") {
            const currentUserRoom = (_a = allUser.find((x) => x.socket == socket)) === null || _a === void 0 ? void 0 : _a.room;
            allUser.forEach((user) => {
                if (user.room == currentUserRoom) {
                    user.socket.send(parsedMessage.payload.message);
                }
            });
        }
    });
});
