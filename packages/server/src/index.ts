import {checkMatch} from "@prodo/snoopy-component-search";
import * as fs from "fs";
import * as path from "path";
import createApp from "./app";

const clientDir = path.resolve(__dirname, "../../ui");
const outDir = path.resolve(clientDir, "dist");
const outFile = path.resolve(outDir, "index.html");

export const start = async (port: number = 3000) => {
  const app = createApp(outDir, outFile);

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
