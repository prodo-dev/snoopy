import * as http from "http";
import registerWebsockets from "../src/websockets";
import {findFreePort} from "./helpers/network";

interface Context {
  server: http.Server;
  port: number;
}

let context: Context;

beforeEach(async () => {
  const server = new http.Server();
  const port = await findFreePort();

  context = {
    server,
    port,
  };

  server.listen(port);
});

afterEach(() => {
  if (context) {
    context.server.close();
  }
});

describe("websockets", () => {
  it("spawns a websocket server", async () => {
    registerWebsockets(context.server);

    const socket = new WebSocket(`ws://localhost:${context.port}`);
    await expect(
      new Promise((resolve, reject) => {
        socket.addEventListener("open", () => resolve(true));
        socket.addEventListener("error", reject);
      }),
    ).resolves.toBe(true);
  });
});
