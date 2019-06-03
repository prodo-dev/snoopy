import * as Express from "express";
import * as http from "http";
import makeDir = require("make-dir");
import * as path from "path";
import * as portfinder from "portfinder";
import applyAliases from "./aliases";
import createBundler from "./bundler";
import registerEndpoints from "./rest";
import {exists, writeFile} from "./utils";
import {watchForComponentsFileChanges} from "./watch";
import registerWebsockets from "./websockets";

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

const getPublicPath = async (
  searchDir: string,
  url: string,
): Promise<string | null> => {
  const publicPath = path.join(searchDir, "public", url);
  const publicFileExists = await exists(publicPath);
  if (publicFileExists) {
    return publicPath;
  }

  return null;
};

export const start = async (
  port: number = startingPort,
  searchDir = process.cwd(),
) => {
  const app = Express();

  const snoopyComponentsModule = path.join(
    searchDir,
    "node_modules",
    "@snoopy",
    "components",
  );
  const componentsFile = path.join(snoopyComponentsModule, "index.ts");
  const libFile = path.join(snoopyComponentsModule, "lib.ts");

  await makeDir(path.dirname(componentsFile));
  await writeFile(componentsFile, "");
  await writeFile(libFile, "");

  // Parcel expects folders in node_modules to have package.json
  const packageFile = path.join(snoopyComponentsModule, "package.json");

  await writeFile(
    packageFile,
    JSON.stringify({name: "@snoopy/components", main: "index.ts"}),
  );

  const bundler = createBundler({
    clientDir,
    outDir,
    outFile,
    searchDir,
    componentsFile,
    libFile,
  });
  applyAliases(bundler);

  await watchForComponentsFileChanges(searchDir, () => {
    // We need to do this to avoid compiling and pushing `filename` at the
    // same time as `componentsFile`.
    (bundler as any).onChange(componentsFile);
  });

  const server = new http.Server(app);
  const ws = registerWebsockets(server);

  registerEndpoints(app, ws, searchDir);
  app.use(Express.static(outDir));

  app.get("/*", async (req, response) => {
    const publicPath = await getPublicPath(searchDir, req.path.substring(1));
    if (publicPath) {
      return response.sendFile(publicPath);
    }
    response.sendFile((bundler as any).mainBundle.name);
  });

  const actualPort = await portfinder.getPortPromise({
    port,
    stopPort: port + portTriesLimit,
  });

  let started = false;
  bundler.on("bundled", () => {
    if (!started) {
      started = true;

      process.stdout.write(`Starting server on port ${port}...\n`);

      if (actualPort !== port) {
        process.stdout.write(
          `Port ${port} is already taken. Starting server on port ${actualPort} instead.\n`,
        );
      }

      server.listen(actualPort, () => {
        process.stdout.write(
          `Server is running at http://localhost:${actualPort}.\n`,
        );
      });
    }
  });

  await bundler.bundle();
};
