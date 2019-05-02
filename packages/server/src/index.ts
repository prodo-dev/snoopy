import {checkMatch} from "@prodo/snoopy-search";
import * as Express from "express";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import createBundler from "./bundler";
import registerWebsockets from "./websockets";

const clientDir = path.resolve(__dirname, "../../ui");
const outDir = path.resolve(clientDir, "dist");
const outFile = path.resolve(outDir, "index.html");

export const start = async (port: number = 3000, searchDir = process.cwd()) => {
  const app = Express();

  const bundler = createBundler(outDir, outFile, searchDir);
  app.use(bundler.middleware());

  const componentsFile = path.resolve(clientDir, "src/components.ts");
  fs.watch(process.cwd(), {recursive: true}, async (_, filename) => {
    // TODO: Try/catch?
    if (checkMatch(filename)) {
      // We need to do this to avoid compiling and pushing `filename` at the
      // same time as `componentsFile`.
      await (bundler as any).onChange(componentsFile);
    }
  });

  process.stdout.write(`Starting server on port ${port}...\n`);

  const server = new http.Server(app);

  registerWebsockets(server);
  server.listen(3000);
};
