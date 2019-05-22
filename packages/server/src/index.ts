import {checkMatch} from "@prodo-ai/snoopy-search";
import * as chokidar from "chokidar";
import * as Express from "express";
import * as http from "http";
import makeDir = require("make-dir");
import * as path from "path";
import applyAliases from "./aliases";
import createBundler from "./bundler";
import {generateComponentsFileContents} from "./generate";
import registerEndpoints from "./rest";
import {exists, writeFile} from "./utils";
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

  let generated = await generateComponentsFileContents(
    ".",
    process.env.PRODO_SEARCH_DIR || "",
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

  chokidar
    .watch(".", {
      cwd: searchDir,
      ignoreInitial: true,
      ignored: /node_modules|\.git|flycheck_*/,
    })
    .on("all", async (_, filename) => {
      try {
        const matches = await checkMatch(filename);
        if (matches) {
          const newGenerated = await generateComponentsFileContents(
            ".",
            process.env.PRODO_SEARCH_DIR || "",
          );
          if (generated !== newGenerated) {
            generated = newGenerated;

            // We need to do this to avoid compiling and pushing `filename` at the
            // same time as `componentsFile`.
            (bundler as any).onChange(componentsFile);
          }
        }
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.warn("Error handling file change:", filename, "\n", e);
      }
    });

  process.stdout.write(`Starting server on port ${port}...\n`);

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

  const listen = (portNumber: number) => {
    app
      .listen(portNumber, () => {
        process.stdout.write(
          `Server is running at http://localhost:${portNumber}.\n`,
        );
      })
      .on("error", e => {
        if (portNumber - port > portTriesLimit) {
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

  listen(port);
};
