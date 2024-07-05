'use client'
import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

// Define types for message object
type Message = {
  username: string;
  message: string;
};

const Home: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    async function socketInitializer() {
      try {
        // Connect to the socket route on the server
        const newSocket = io("/api/socket/route");
        setSocket(newSocket);

        newSocket.on("receive-message", (data: Message) => {
          setAllMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
          newSocket.disconnect();
        };
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    }

    socketInitializer();

    // Clean up function
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (socket) {
      console.log("emitted");
      socket.emit("send-message", {
        username,
        message,
      });
      setMessage("");
    } else {
      console.error("Socket is not initialized");
    }
  }

  return (
    <div>
      <h1>Chat app</h1>
      <h2>Enter a username</h2>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
      />

      <br />
      <br />

      <div>
        {allMessages.map(({ username, message }, index) => (
          <div key={index}>
            {username}: {message}
          </div>
        ))}

        <br />

        <form onSubmit={handleSubmit}>
          <input
            name="message"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
