import {checkMatch} from "@prodo/snoopy-search";
import * as Express from "express";
import * as fs from "fs";
import * as path from "path";
import createBundler from "./bundler";

const clientDir = path.resolve(__dirname, "../../ui");
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

  await fs.promises.mkdir(path.dirname(componentsFile), {recursive: true});
  await fs.promises.writeFile(componentsFile, "");

  const bundler = createBundler(outDir, outFile, searchDir, componentsFile);
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
  app.listen(3000);
};
