import { MongoClient, Db } from "mongodb"


const url = 'mongodb://localhost:27017'


let db: Db
let userDB: Db


export const connectToDB = async function() {
    try {
        const clientConnection = await MongoClient.connect(url, { useUnifiedTopology: true })
        db = await clientConnection.db("chatuser")
        userDB = await clientConnection.db("chatapp")
        
        console.log("connected to db!")
    } catch(err) {
        console.log(err)
    }
}


export const getDB = function() {
    return db
}


export const getUserDB = function() {
    return userDB
}