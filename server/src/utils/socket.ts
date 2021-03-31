import { Socket } from "socket.io"


import { leaveRoom, Room } from "../chat/room"

 
const InitSocket = (io: any) => {
    io.on("connect", (socket: Socket) => {
        Room(io, socket)

        socket.on("disconnecting", () => {
            leaveRoom(socket)
        })
    })
}


export default InitSocket