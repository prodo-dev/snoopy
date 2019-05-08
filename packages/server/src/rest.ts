import * as express from "express";
import * as WebSocket from "ws";
import { WebSocketEvents } from "@prodo/snoopy-api";
import * as bodyParser from "body-parser";
import * as path from "path";

export default (app: express.Application, ws: WebSocket.Server, searchDir: string) => {
  app.use(bodyParser.text());
  app.post("/open-file", (req, res) => {
    const file = req.body;
    ws.clients.forEach(client => {
      client.send(JSON.stringify({ type: WebSocketEvents.OPEN_FILE, file: path.relative(searchDir, file) }))
    })
    res.send();
  });
};
