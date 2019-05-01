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

  const bundler = createBundler(outFile, outDir, searchDir);
  app.use(bundler.middleware());

  const componentsFile = path.resolve(clientDir, "src/components.ts");
  fs.watch(process.cwd(), {recursive: true}, (_, filename) => {
    if (checkMatch(filename)) {
      const contents = fs.readFileSync(componentsFile);
      fs.writeFileSync(componentsFile, contents);
    }
  });

  process.stdout.write(`Starting server on port ${port}...\n`);
  app.listen(3000);
};
