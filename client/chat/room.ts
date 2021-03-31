import socket from "../utils/socket"
import { IMessage } from "../types/message"


// listeners
export const onJoinRoom = (handler: Function) => {
    socket.on("room:join", (message: IMessage) => {
        handler(message)
    })
}


export const onLeaveRoom = (handler: Function) => {
    socket.on("room:leave", (message: IMessage) => {
        handler(message)
    })
}


export const onMessage = (handler: Function) => {
    socket.on("room:message", (message: IMessage) => {
        handler(message)
    })
}


// emiters
export const joinRoom = (roomId: string) => {
    socket.emit("room:join", roomId)
}


export const leaveRoom = (roomId: string) => {
    socket.emit("room:leave", roomId)
}


export const sendMessage = (data) => {
    socket.emit("room:message", data)
}