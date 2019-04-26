import * as Express from "express";
import * as Bundler from "parcel-bundler";
import * as fs from "fs";
import * as path from "path";

const clientDir = path.resolve(__dirname, "../../ui");
const entryFile = path.resolve(clientDir, "./public/index.html");
const outDir = path.resolve(clientDir, "dist");
const outFile = path.resolve(outDir, "index.html");

export const start = async (port: number = 3000) => {
  const app = Express();

  const options = {
    outDir,
    outFile,
    watch: true,
    cache: false,
    minify: false,
    scopeHoist: false,
    hmr: true,
    detailedReport: false,
    bundleNodeModules: true,
  };

  const bundler = new Bundler(entryFile, options);
  bundler.addAssetType(".ts", require.resolve("./component-asset"));

  fs.watch(process.cwd(), {recursive: true}, () => {
    console.log("\nBUNDLE\n");
    bundler.bundle();
  });

  process.stdout.write(`Starting server on port ${port}...\n`);
  app.use(bundler.middleware());
  app.listen(3000);
};
