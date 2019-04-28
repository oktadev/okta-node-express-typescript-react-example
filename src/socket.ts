import OktaJwtVerifier from "@okta/jwt-verifier";
import okta from "@okta/okta-sdk-nodejs";
import { Server, Socket } from "socket.io";
import uuid from "uuid/v4";

const messageExpirationTimeMS = 10 * 1000;

export interface IUser {
  id: string;
  name: string;
}

const defaultUser: IUser = {
  id: "anon",
  name: "Anonymous",
};

export interface IMessage {
  user: IUser;
  id: string;
  time: Date;
  value: string;
}

const jwtVerifier = new OktaJwtVerifier({
  clientId: process.env.OKTA_CLIENT_ID,
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
});

const oktaClient = new okta.Client({
  orgUrl: process.env.OKTA_ORG_URL,
  token: process.env.OKTA_TOKEN,
});

const sendMessage = (socket: Socket | Server) =>
  (message: IMessage) => socket.emit("message", message);

export default (io: Server) => {
  const users: Map<Socket, IUser> = new Map();
  const messages: Set<IMessage> = new Set();

  io.use(async (socket, next) => {
    const { token = null } = socket.handshake.query || {};
    if (token) {
      try {
        const [authType, tokenValue] = token.trim().split(" ");
        if (authType !== "Bearer") {
          throw new Error("Expected a Bearer token");
        }

        const { claims: { sub } } = await jwtVerifier.verifyAccessToken(tokenValue);
        const user = await oktaClient.getUser(sub);

        users.set(socket, {
          id: user.id,
          name: [user.profile.firstName, user.profile.lastName].filter(Boolean).join(" "),
        });
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
      }
    }

    next();
  });

  io.on("connection", (socket) => {
    socket.on("getMessages", () => {
      messages.forEach(sendMessage(socket));
    });

    socket.on("message", (value: string) => {
      const message: IMessage = {
        id: uuid(),
        time: new Date(),
        user: users.get(socket) || defaultUser,
        value,
      };

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
      users.delete(socket);
    });
  });
};
