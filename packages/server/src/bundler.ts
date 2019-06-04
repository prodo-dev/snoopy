import * as Bundler from "parcel-bundler";
import * as path from "path";

export default (
  {
    clientDir,
    outDir,
    outFile,
  }: {
    clientDir: string;
    outDir: string;
    outFile: string;
  },
  options?: any,
) => {
  const entryFile = path.join(clientDir, "public", "index.html");

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
    autoInstall: false,
    ...options,
  };

  const bundler = new Bundler(entryFile, options);

  return bundler;
};
