import {checkMatch} from "@prodo/snoopy-search";
import * as Express from "express";
import * as fs from "fs";
import * as http from "http";
import makeDir = require("make-dir");
import * as path from "path";
import {promisify} from "util";
import createBundler from "./bundler";
import registerWebsockets from "./websockets";

const writeFile = promisify(fs.writeFile);

const clientDir = path.dirname(
  path.dirname(require.resolve("@prodo/snoopy-ui")),
);
const outDir = path.resolve(clientDir, "dist");
const outFile = path.resolve(outDir, "index.html");

export const start = async (port: number = 3000, searchDir = process.cwd()) => {
  const app = Express();

  const componentsFile = path.join(
    searchDir,
    "node_modules",
    "@prodo",
    "components",
    "index.ts",
  );

  await makeDir(path.dirname(componentsFile));
  await writeFile(componentsFile, "");

  const bundler = createBundler({
    clientDir,
    outDir,
    outFile,
    searchDir,
    componentsFile,
  });
  await bundler.bundle();

  app.use(Express.static(outDir));

  app.get("/*", (_, response) => {
    response.sendFile((bundler as any).mainBundle.name);
  });

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
