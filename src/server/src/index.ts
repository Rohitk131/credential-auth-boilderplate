const express = require('express')
import {Server} from 'socket.io'
import {createServer} from 'http'
import { Socket } from 'dgram'
const server = createServer()

const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["POST", "GET"]
    }
})
io.on("connect", (socket)=>{
    io.emit("message", "Hello user from backend", socket.id)
})

server.listen(4000, ()=>{
    console.log("Server started on port 4000" )
})