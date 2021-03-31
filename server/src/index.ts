// config env variables
require('dotenv').config()

import express from "express"
import cors, { CorsOptions } from "cors"
import { connectToDB } from "./utils/db"
import InitSocket from "./utils/socket"
import cookieParser from "cookie-parser"


// error handler
import errorHandler from "./handlers/error"


// routes
import userRoutes from "./routes/user"


// connect to the data base
connectToDB()


// server setup
const app = express()
const httpServer = require("http").Server(app)
const io = require("socket.io")(httpServer, { cors: true })

const port = process.env.PORT || 5000

app.disable('x-powered-by')
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

const blackList: string[] = []
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if(blackList.includes(origin as string)) callback(Error("you are banned from this server!"))

        callback(null, true)
    },
    credentials: true,
}
app.use(cors(corsOptions))


// using routes
app.use("/api", userRoutes)


// 404 middleware
app.use((req, res, next) => {
    const err: any = new Error("route not found.")
    err.status = 404
    next(err)
})


app.use(errorHandler)


// socket initialize
InitSocket(io)


// start server
httpServer.listen(port, () => console.log(`server started at port ${port}!!!`))