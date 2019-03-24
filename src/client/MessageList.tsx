import { Map } from "immutable";
import React, { SyntheticEvent, useEffect, useState } from "react";

import { IMessage } from "../socket";
import { socket } from "./socket";

const MessageList = () => {
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
  }, []);

  return (
    <div>
      {messages
        .toSet()
        .sortBy((message: IMessage) => message.time)
        .map((message: IMessage) => (
          <div key={message.id}>
            {message.value}
          </div>
        )).toArray()
      }
    </div>
  );
};

export default MessageList;
