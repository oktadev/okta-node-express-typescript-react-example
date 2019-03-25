import { withAuth } from "@okta/okta-react";
import { Map } from "immutable";
import React, { SyntheticEvent, useEffect, useState } from "react";
import io from "socket.io-client";

import { useAuth } from "./auth";
import MessageList from "./MessageList";
import NewMessage from "./NewMessage";

export default withAuth(({ auth }) => {
  const [authenticated, user, token] = useAuth(auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(location.origin, token && { query: { token } });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [token]);

  return socket && (
    <div>
      {user ? (
        <div>
          Signed in as {user.name}
          <button onClick={() => auth.logout()}>Sign out</button>
        </div>
      ) : (
        <div>
          Not signed in
          <button onClick={() => auth.login()}>Sign in</button>
        </div>
      )}
      <MessageList socket={socket} />
      <NewMessage socket={socket} />
    </div>
  );
});
