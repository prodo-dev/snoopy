import * as Express from "express";
import * as fs from "fs";
import * as Bundler from "parcel-bundler";
import * as path from "path";

const clientDir = path.resolve(__dirname, "../../ui");
const entryFile = path.resolve(clientDir, "./public/index.html");
const outDir = path.resolve(clientDir, "dist");
const outFile = path.resolve(outDir, "index.html");

export const start = async (componentsPath: string, port: number = 3000) => {
  const app = Express();

  const componentsOutDir = path.resolve(clientDir);
  const componentsGeneratedPath = path.resolve(
    clientDir,
    "components-generated.ts",
  );
  const importPath = path.relative(
    componentsOutDir,
    path.resolve(process.cwd(), componentsPath),
  );

  fs.writeFileSync(
    componentsGeneratedPath,
    `export { components } from "${importPath}";`,
  );

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

  // bundler.addPackager("tsx", require.resolve("./component-packager"));
  // bundler.addAssetType("template", require.resolve("./component-asset"));
  bundler.bundle();

  app.use(bundler.middleware());
  app.listen(3000);

  // tslint:disable-next-line:no-console
  console.log(`Starting server on port ${port}`);
};
