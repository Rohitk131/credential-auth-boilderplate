import { Server, Socket } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!(res.socket.server.io)) {
    const io = new Server(res.socket.server);

    io.on("connection", (socket: Socket) => {
      socket.on("send-message", (obj: any) => {
        io.emit("receive-message", obj);
      });
    });

    console.log("Setting up socket");
    (res.socket as any).server.io = io;
  } else {
    console.log("Already set up");
  }

  res.end();
}
