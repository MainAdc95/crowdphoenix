"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
// server setup
var app = express_1.default();
var httpServer = require("http").createServer();
var io = require("socket.io")(httpServer, { cors: true });
var port = process.env.PORT || 5000;
app.disable('x-powered-by');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
var blackList = [];
var corsOptions = {
    origin: function (origin, callback) {
        if (blackList.includes(origin))
            callback(Error("you are banned from this server!"));
        callback(null, true);
    },
    credentials: true,
};
app.use(cors_1.default(corsOptions));
io.on("connection", function (socket) {
    console.log(socket);
});
// start server
httpServer.listen(port, function () { return console.log("server started at port " + port + "!!!"); });
