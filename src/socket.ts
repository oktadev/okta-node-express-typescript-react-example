import { Server, Socket } from "socket.io";
import uuid from "uuid/v4";

const messageExpirationTimeMS = 10 * 1000;

export interface IUser {
  id?: string;
  name: string;
}

export interface IMessage {
  userId?: string;
  id: string;
  time: Date;
  value: string;
}

const sendMessage = (socket: Socket | Server) => (message: IMessage) => {
  socket.emit("message", {
    id: message.id,
    time: message.time,
    user: {
      id: message.userId,
    },
    value: message.value,
  });
};

export default (io: Server) => {
  const users: Map<string, IUser> = new Map();
  const sockets: Set<Socket> = new Set();

  const messages: Set<IMessage> = new Set();

  const sendMessageToAllSockets = (message: IMessage) => {
    sockets.forEach((socket) => sendMessage(socket)(message));
  };

  io.on("connection", (socket) => {
    sockets.add(socket);

    socket.on("getMessages", () => {
      messages.forEach(sendMessage(socket));
    });

    socket.on("message", (value: string) => {
      const message: IMessage = { time: new Date(), value, id: uuid() };
      messages.add(message);

      sendMessage(io)(message);

      setTimeout(
        () => {
          messages.delete(message);
          io.emit("deleteMessage", message.id);
        },
        messageExpirationTimeMS,
      );
    });

    socket.on("disconnect", () => {
      sockets.delete(socket);
    });
  });
};
