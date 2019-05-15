import * as Bundler from "parcel-bundler";
import * as path from "path";

export default (
  {
    clientDir,
    outDir,
    outFile,
    searchDir,
    componentsFile,
  }: {
    clientDir: string;
    outDir: string;
    outFile: string;
    searchDir: string;
    componentsFile: string;
  },
  options: any,
) => {
  const entryFile = path.join(clientDir, "public", "index.html");

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
    auotInstall: false,
    ...options,
  };

  const bundler = new Bundler(entryFile, options);
  bundler.addAssetType(".ts", require.resolve("./component-asset"));

  return bundler;
};
