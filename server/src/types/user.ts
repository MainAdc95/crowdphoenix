export interface IUser {
    _id: string
    username: string
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    isAdmin: boolean
    isSuperAdmin: boolean
    version: number
    status: "online" | "offline"
}