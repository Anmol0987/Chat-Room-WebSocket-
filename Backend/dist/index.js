"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let user = 0;
let allusers = [];
wss.on("connection", (socket) => {
    allusers.push(socket);
    user = user + 1;
    socket.on("message", (msg) => {
        console.log(msg.toString);
        for (let i = 0; i < allusers.length; i++) {
            const s = allusers[i];
            s.send(msg.toString() + " from server");
        }
    });
});
