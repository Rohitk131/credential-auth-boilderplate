import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { MongoClient, Db } from 'mongodb';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// MongoDB connection URL and database name
const mongoUrl = 'mongodb://localhost:27017'; // Update with your MongoDB URL
const dbName = 'chatApp'; // Update with your database name

let db: Db | undefined; // MongoDB database reference

// Connect to MongoDB
const connectToMongoDB = async () => {
    const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
};

// Handle socket.io events
io.on('connection', (socket: Socket) => {
    console.log('New client connected');

    socket.on('joinRoom', async ({ username, room }: { username: string, room: string }) => {
        await connectToMongoDB();
        if (db) {
            socket.join(room);
            console.log(`${username} joined room ${room}`);

            try {
                // Retrieve last 10 messages from MongoDB
                const messages = await db.collection('messages')
                    .find({ room })
                    .sort({ createdAt: -1 })
                    .limit(10)
                    .toArray();

                // Send messages to the client
                socket.emit('loadMessages', messages.reverse());
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        } else {
            console.error('MongoDB connection not established.');
        }
    });

    socket.on('sendMessage', async ({ room, username, message }: { room: string, username: string, message: string }) => {
        await connectToMongoDB();
        if (db) {
            try {
                // Save message to MongoDB
                await db.collection('messages').insertOne({
                    room,
                    username,
                    message,
                    createdAt: new Date(),
                });

                // Emit message to all clients in the room
                io.to(room).emit('message', { username, message, createdAt: new Date() });
            } catch (error) {
                console.error('Error saving message:', error);
            }
        } else {
            console.error('MongoDB connection not established.');
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
