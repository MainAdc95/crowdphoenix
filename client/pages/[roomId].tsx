import React, { useEffect, useRef, useState } from "react"
import { joinRoom, sendMessage, onMessage, onJoinRoom, onLeaveRoom, leaveRoom } from "../chat/room"
import { IMessage } from "../types/message"
import { GetServerSideProps } from "next"


// style sheets
import styles from "../styles/Room.module.css"


interface IProps {
    roomId: string
}


const Room = ({ roomId }: IProps) => {
    const [message, setMessage] = useState<string>("")
    const [lastMessage, setLastMessage] = useState<IMessage | null>(null)
    const [chat, setChat] = useState<IMessage[]>([])
    const endChatAnchor = useRef<HTMLDivElement | null>(null)


    useEffect(() => {
        joinRoom(roomId)

        onMessage((message: IMessage) => {
            setLastMessage(message)
        })

        onJoinRoom((message: IMessage) => {
            setLastMessage(message)
        })

        onLeaveRoom((message: IMessage) => {
            setLastMessage(message)
        })

        return () => {
            leaveRoom(roomId)
        }
    }, [])


    useEffect(() => {
        if(endChatAnchor.current) {
            endChatAnchor.current.scrollIntoView()
        }
    }, [chat])


    useEffect(() => {
        if(lastMessage) {
            setChat([...chat, lastMessage])
            setLastMessage(null)
        }
    }, [lastMessage])


    const handleSendMessage = () => {
        if(message) {
            sendMessage({ roomId, message })
            setMessage("")
        }
    }


    return (
        <div className={styles.container}>
            <div className={styles.videoSection}>
                <p>videos container</p>
            </div>
            <div className={styles.chatSection}>
                <div className={styles.chatContainer}>
                    {chat.map((message, i) => (
                        <div key={i}>
                            <p>{message.text}</p>
                        </div>
                    ))}
                    <div ref={endChatAnchor}></div>
                </div>
                <div className={styles.chatControlsBar}>
                    <div className={styles.chatMsgInputContainer}>
                        <textarea 
                            className={styles.chatMsgInput} 
                            placeholder="type a message"
                            data-gramm_editor="false"
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                        ></textarea>
                    </div>
                    <div className={styles.chatSendBtnContainer}>
                        <button 
                            className={styles.chatSendBtn}
                            onClick={handleSendMessage}
                        >
                            send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const roomId: string = ctx.query?.roomId as string


    return {
        props: {
            roomId
        }
    }
}


export default Room