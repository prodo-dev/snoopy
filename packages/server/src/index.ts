import {checkMatch} from "@prodo-ai/snoopy-search";
import * as chokidar from "chokidar";
import * as Express from "express";
import * as fs from "fs";
import * as http from "http";
import makeDir = require("make-dir");
import * as path from "path";
import {promisify} from "util";
import applyAliases from "./aliases";
import createBundler from "./bundler";
import registerEndpoints from "./rest";
import registerWebsockets from "./websockets";

const writeFile = promisify(fs.writeFile);

const clientDir = path.dirname(
  path.dirname(require.resolve("@prodo-ai/snoopy-ui")),
);
const outDir = path.resolve(clientDir, "dist");
const outFile = path.resolve(outDir, "index.html");
const defaultPort = 3042;
const startingPort = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : defaultPort;
const portTriesLimit = 100;

export const start = async (
  port: number = startingPort,
  searchDir = process.cwd(),
) => {
  const app = Express();

  const prodoComponentsModule = path.join(
    searchDir,
    "node_modules",
    "@prodo",
    "components",
  );
  const componentsFile = path.join(prodoComponentsModule, "index.ts");

  await makeDir(path.dirname(componentsFile));
  await writeFile(componentsFile, "");

  // Parcel expects folders in node_modules to have package.json
  const packageFile = path.join(prodoComponentsModule, "package.json");
  await writeFile(
    packageFile,
    JSON.stringify({name: "@prodo/components", main: "index.ts"}),
  );

  const bundler = createBundler({
    clientDir,
    outDir,
    outFile,
    searchDir,
    componentsFile,
  });
  applyAliases(bundler);

  await bundler.bundle();

  app.use(Express.static(outDir));

  chokidar
    .watch(".", {ignored: /(^|[\/\\])\../})
    .on("all", async (_, filename) => {
      const matches = await checkMatch(filename);
      if (matches) {
        // We need to do this to avoid compiling and pushing `filename` at the
        // same time as `componentsFile`.
        await (bundler as any).onChange(componentsFile);
      }
    });

  process.stdout.write(`Starting server on port ${port}...\n`);

  const server = new http.Server(app);
  const ws = registerWebsockets(server);

  registerEndpoints(app, ws, searchDir);

  app.get("/*", (_, response) => {
    response.sendFile((bundler as any).mainBundle.name);
  });

  const listen = (portNumber: number) => {
    app
      .listen(portNumber, () => {
        process.stdout.write(
          `Server is running at http://localhost:${portNumber}.\n`,
        );
      })
      .on("error", e => {
        if (portNumber - startingPort > portTriesLimit) {
          process.stdout.write(`Tried ${portTriesLimit} ports, giving up.`);
        } else if ((e as any).code === "EADDRINUSE") {
          process.stdout.write(
            `Port ${portNumber} is busy, trying ${portNumber + 1}...\n`,
          );
          listen(portNumber + 1);
        } else {
          process.stdout.write(`${e.message}\n`);
        }
      });
  };

  listen(startingPort);
};
