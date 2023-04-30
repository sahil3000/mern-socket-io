import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
const port = 5000;

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000']
    }
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/", (req, res) => {
    res.send("welcome to socket io tutorial")
});

io.on("connection", (socket) => {
    console.log("connection is ready");

    // socket
    socket.on('send-message', (data) => {
        console.log("data", data);
        // socket.emit('message-from-server', data);
        
        // not themselve
        socket.broadcast.emit('message-from-server', data);
    });


    socket.on("typing-started", () => {
        socket.broadcast.emit("typing-started-from-server")
    });

    socket.on("typing-stoped", () => {
        socket.broadcast.emit("typing-stoped-from-server")
    });

    socket.on("disconnect", () => {
        console.log("user disconnect ")
    })
})

httpServer.listen(port, () => {
    console.log(`http://localhost:${port}`)
})