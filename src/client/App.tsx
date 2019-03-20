import { Map } from "immutable";
import React, { SyntheticEvent, useEffect, useState } from "react";

import MessageList from "./MessageList";
import NewMessage from "./NewMessage";

export default () => (
  <div>
    <MessageList />
    <NewMessage />
  </div>
);
