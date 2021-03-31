import { IUser } from "../types/user"


export interface IRoom {
    _id: string
    count: number
    users: IUser[]
    createdAt: Date
}