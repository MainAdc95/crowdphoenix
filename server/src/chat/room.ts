import { Socket } from "socket.io"
import { IMessage } from "../types/message"
import { IRoom } from "../types/room"



export const Room = (io: any, socket: Socket) => {
    socket.on("room:join", (roomId: string) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit("room:join", {
            text: "a user has joined this room.",
            createdAt: Date.now(),
        })
    })

    socket.on("room:leave", (roomId: string)  => {
        socket.leave(roomId)
        socket.broadcast.to(roomId).emit("room:leave", {
            text: "a user has left this room.",
            createdAt: Date.now(),
        })
    })

    socket.on("room:message", ({ roomId, message }: { roomId: string, message: IMessage }) => {
        io.to(roomId).emit("room:message", {
            text: message,
            createdAt: Date.now(),
        })
    })
}


export const leaveRoom = (socket: Socket) => {
    socket.rooms.forEach(room => {
        socket.leave(room)
        socket.broadcast.to(room).emit("room:leave", {
            text: "a user has left this room.",
            createdAt: Date.now(),
        })
    })
}