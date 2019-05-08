import * as http from "http";
import * as WebSocket from "ws";

export default (server: http.Server) => {
  const wss = new WebSocket.Server({server});

  // tslint:disable-next-line:no-empty
  wss.on("connection", () => {});
};
