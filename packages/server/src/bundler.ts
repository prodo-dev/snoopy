import * as Bundler from "parcel-bundler";
import * as path from "path";

const clientDir = path.resolve(__dirname, "..", "..", "ui");
const entryFile = path.join(clientDir, "public", "index.html");

export default (
  outDir: string,
  outFile: string,
  searchDir: string,
  componentsFile: string,
  options: Bundler.ParcelOptions = {},
) => {
  process.env.PRODO_SEARCH_DIRECTORY = searchDir;
  process.env.PRODO_COMPONENTS_FILE = path.relative(
    path.join(clientDir, "src", "App"),
    componentsFile,
  );

  options = {
    outDir,
    outFile,
    watch: true,
    cache: false,
    minify: false,
    scopeHoist: false,
    hmr: true,
    detailedReport: false,
    bundleNodeModules: true,
    ...options,
  };

  const bundler = new Bundler(entryFile, options);
  bundler.addAssetType(".ts", require.resolve("./component-asset"));

  return bundler;
};
