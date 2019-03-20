import { Map } from "immutable";
import React, { SyntheticEvent, useEffect, useState } from "react";

import { IMessage } from "../socket";
import { socket } from "./socket";

const MessageList = () => {
  const [messages, setMessages] = useState(Map());

  useEffect(() => {
    const listener = (message: IMessage) => {
      setMessages((prevMessages) => prevMessages.set(message.id, message));
    };

    socket.on("message", listener);
    socket.emit("getMessages");

    return () => socket.off("message", listener);
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
