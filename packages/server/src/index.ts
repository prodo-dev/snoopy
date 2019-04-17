import * as Express from "express";
import * as Bundler from "parcel-bundler";
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
    minify: false,
    scopeHoist: false,
    hmr: true,
    detailedReport: false,
    bundleNodeModules: true,
  };

  const bundler = new Bundler(entryFile, options);
  bundler.bundle();

  app.use(bundler.middleware());
  app.listen(3000);

  // tslint:disable-next-line:no-console
  console.log(`Starting server on port ${port}`);
};
