import { IUser } from "./user";

export interface IMessage {
    user: IUser
    text: string
    createdAt: Date
}