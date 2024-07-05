import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io, { Socket } from 'socket.io-client';

interface Message {
    username: string;
    message: string;
    createdAt: Date;
}

const ChatPage = () => {
    const router = useRouter();
    const { username } = router.query;
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(); // Initialize Socket.io client
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket && username) {
            socket.emit('joinRoom', { username, room: 'defaultRoom' });

            socket.on('loadMessages', (msgs: Message[]) => {
                setMessages(msgs);
            });

            socket.on('message', (msg: Message) => {
                setMessages((prevMessages) => [...prevMessages, msg]);
            });
        }

        return () => {
            if (socket) {
                socket.off('loadMessages');
                socket.off('message');
            }
        };
    }, [socket, username]);

    const handleSendMessage = () => {
        if (message.trim() && socket) {
            socket.emit('sendMessage', { room: 'defaultRoom', username, message });
            setMessage('');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl p-8 space-y-4">
                <h1 className="text-2xl font-bold">Chat</h1>
                <div className="border rounded p-4 space-y-2 max-h-96 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <span className="font-bold">{msg.username}</span>: {msg.message}{' '}
                            <span className="text-xs text-gray-500">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Type a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        className="p-2 bg-blue-500 text-white rounded"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;

