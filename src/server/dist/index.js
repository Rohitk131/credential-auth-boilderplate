"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const server = (0, http_1.createServer)();
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["POST", "GET"]
    }
});
io.on("connect", (socket) => {
    io.emit("message", "Hello user from backend", socket.id);
});
server.listen(4000, () => {
    console.log("Server started on port 4000");
});
