export interface IUser {
    _id: string
    name: string
    status: "online" | "offline"
}


export const users: IUser[] = [
    {
        _id: "1",
        name: "mustafa",
        status: "offline"
    },
    {
        _id: "2",
        name: "mohammed",
        status: "offline"
    },
    {
        _id: "3",
        name: "ahmed",
        status: "offline"
    },
]