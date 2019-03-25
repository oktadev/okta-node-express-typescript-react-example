import { Map } from "immutable";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Socket } from "socket.io";

interface IProps {
  socket: Socket;
}

import "./MessageList.scss";

import { IMessage } from "../socket";

const MessageList = ({ socket }: IProps) => {
  const [messages, setMessages] = useState(Map());

  useEffect(() => {
    const messageListener = (message: IMessage) => {
      setMessages((prevMessages) => prevMessages.set(message.id, message));
    };

    const deleteMessageListener = (messageID: string) => {
      setMessages((prevMessages) => prevMessages.delete(messageID));
    };

    socket.on("message", messageListener);
    socket.on("deleteMessage", deleteMessageListener);
    socket.emit("getMessages");

    return () => {
      socket.off("message", messageListener);
      socket.off("deleteMessage", deleteMessageListener);
    };
  }, [socket]);

  return (
    <div className="message-list">
      {messages
        .toSet()
        .sortBy((message: IMessage) => message.time)
        .map((message: IMessage) => (
          <div
            key={message.id}
            className="message-list--message-container"
            title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}
          >
            <span className="message-list--message">{message.value}</span>
            <span className="message-list--user">{message.user.name}</span>
          </div>
        )).toArray()
      }
    </div>
  );
};

export default MessageList;
