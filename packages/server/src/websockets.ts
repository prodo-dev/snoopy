import {WebSocketEvents} from "@prodo/snoopy-api";
import * as http from "http";
import * as WebSocket from "ws";

export default (server: http.Server) => {
  const wss = new WebSocket.Server({server});

  wss.on("connection", (ws: WebSocket) => {
    setTimeout(() => {
      ws.send(JSON.stringify({type: WebSocketEvents.OPEN_COMPONENT}));
    }, 1000);
  });
};
