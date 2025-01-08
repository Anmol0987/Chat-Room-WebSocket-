import { WebSocketServer, WebSocket } from "ws";
const ws = new WebSocketServer({ port: 8080 })
interface User {
    socket: WebSocket;
    room: string;
    name?: string;
}
let allUser: User[] = []
ws.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message as unknown as string)

        if (parsedMessage.type == "join") {
            allUser.push({
                socket,
                room: parsedMessage.payload.roomId,
                name: parsedMessage.payload.name
            })
        }
        if (parsedMessage.type == "chat") {
            const currentUserRoom = allUser.find((x) => x.socket == socket)?.room
            allUser.forEach((user) => {
                if (user.room == currentUserRoom) {
                    user.socket.send(parsedMessage.payload.message)
                }
            })
        }
    })
})
