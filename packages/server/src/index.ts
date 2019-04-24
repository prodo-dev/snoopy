import * as Express from "express";
import * as fs from "fs";
import * as Bundler from "parcel-bundler";
import * as path from "path";
import {findComponentImports} from "@prodo/snoopy-component-search";
import * as watch from "watch";

const clientDir = path.resolve(__dirname, "../../ui");
const entryFile = path.resolve(clientDir, "./public/index.html");
const outDir = path.resolve(clientDir, "dist");
const outFile = path.resolve(outDir, "index.html");

const generateComponentFileContents = async (): Promise<string> => {
  const componentImports = await findComponentImports(clientDir, process.cwd());

  const importString = componentImports
    .map(
      componentImport =>
        `import { ${componentImport.exportNames.join(", ")} } from "${
          componentImport.filepath
        }"`,
    )
    .join("\n");

  const componentsArrayString = componentImports
    .map(componentImport =>
      componentImport.exportNames
        .map(name => `{name: "${name}", component: ${name}}`)
        .join(","),
    )
    .join(",\n  ");

  return `
${importString};

export const components = [
  ${componentsArrayString}
];
`.trimLeft();
};

const generateComponentListFile = async () => {
  const componentsGeneratedPath = path.resolve(
    clientDir,
    "components-generated.ts",
  );

  const generatedFileContents = await generateComponentFileContents();

  fs.writeFileSync(componentsGeneratedPath, generatedFileContents);
};

export const start = async (port: number = 3000) => {
  const app = Express();

  generateComponentListFile();

  watch.watchTree(process.cwd(), () => {
    generateComponentListFile();
  });

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

  bundler.bundle();

  app.use(bundler.middleware());
  app.listen(3000);

  // tslint:disable-next-line:no-console
  console.log(`Starting server on port ${port}`);
};
