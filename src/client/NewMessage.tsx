import React, { SyntheticEvent, useState } from "react";

import { socket } from "./socket";

const NewMessage = () => {
  const [value, setValue] = useState("");
  const submitForm = (e: SyntheticEvent) => {
    e.preventDefault();
    setValue("");

    socket.emit("message", value);
  };

  return (
    <form onSubmit={submitForm}>
      <input
        autoFocus
        value={value}
        onChange={(e: SyntheticEvent<HTMLInputElement>) => {
          setValue(e.currentTarget.value);
        }}
      />
    </form>
  );
};

export default NewMessage;
