import * as Express from "express";
import * as Bundler from "parcel-bundler";
import * as path from "path";

const clientDir = path.resolve(__dirname, "../../ui");
const entryFile = path.resolve(clientDir, "./public/index.html");

export default (outDir: string, outFile: string) => {
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

  app.use(bundler.middleware());
  return app;
};
