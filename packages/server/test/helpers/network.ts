import * as net from "net";

export const findFreePort = (): Promise<number> =>
  new Promise((resolve, reject) => {
    const server = new net.Server();
    server.listen({port: 0}, ((error?: Error) => {
      if (error) {
        reject(error);
        return;
      }
      const address = server.address() as net.AddressInfo;
      const port = address.port;
      server.close((err?: Error) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(port);
      });
    }) as () => {});
  });
