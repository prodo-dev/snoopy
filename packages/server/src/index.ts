import {findProjectRoot} from "@prodo-ai/snoopy-search";
import * as Express from "express";
import * as http from "http";
import makeDir = require("make-dir");
import * as path from "path";
import * as portfinder from "portfinder";
import applyAliases from "./aliases";
import createBundler from "./bundler";
import {generateComponentsFileContents, generateLibsFile} from "./generate";
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

// These environment variables  are used in the Snoopy UI  and must be
// set before bundling
export const setEnvVars = ({
  searchDir,
  componentsFile,
  libFile,
}: {
  searchDir: string;
  componentsFile: string;
  libFile: string;
}) => {
  process.env.PRODO_SEARCH_DIRECTORY = searchDir;
  process.env.PRODO_COMPONENTS_FILE = path.relative(
    path.join(clientDir, "src", "App"),
    componentsFile,
  );
  process.env.PRODO_LIB_FILE = path.relative(
    path.join(clientDir, "src", "App"),
    libFile,
  );
};

export const start = async (
  port: number = startingPort,
  searchDirOption?: string,
) => {
  const searchDir =
    searchDirOption || (await findProjectRoot(process.cwd())) || process.cwd();

  process.stdout.write(`Searching ${searchDir} for components...\n`);

  const app = Express();

  const snoopyModule = path.join(
    searchDir,
    "node_modules",
    "@snoopy",
    "components",
  );
  const componentsFile = path.join(snoopyModule, "index.ts");
  const libFile = path.join(snoopyModule, "lib.ts");

  setEnvVars({searchDir, componentsFile, libFile});

  let componentsFileContents = await generateComponentsFileContents(
    snoopyModule,
    searchDir,
  );

  const libFileContents = await generateLibsFile();

  await makeDir(path.dirname(componentsFile));

  await writeFile(componentsFile, componentsFileContents);
  await writeFile(libFile, libFileContents);

  // Parcel expects folders in node_modules to have package.json
  const packageFile = path.join(snoopyModule, "package.json");

  await writeFile(
    packageFile,
    JSON.stringify({name: "@snoopy/components", main: "index.ts"}),
  );

  const bundler = createBundler({
    clientDir,
    outDir,
    outFile,
  });
  applyAliases(bundler);

  await bundler.bundle();

  await watchForComponentsFileChanges(searchDir, async () => {
    const newComponentsFileContents = await generateComponentsFileContents(
      snoopyModule,
      searchDir,
    );
    if (newComponentsFileContents !== componentsFileContents) {
      componentsFileContents = newComponentsFileContents;

      await writeFile(componentsFile, componentsFileContents);
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

  const actualPort = await portfinder.getPortPromise({
    port,
    stopPort: port + portTriesLimit,
  });

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
};
