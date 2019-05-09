import * as http from "http";
import * as WebSocket from "ws";

export default (server: http.Server) => {
  return new WebSocket.Server({server});
};
