import * as Express from "express";
import * as fs from "fs";
import * as Bundler from "parcel-bundler";
import * as path from "path";
import {findComponentImports} from "@prodo/snoopy-component-search";

const clientDir = path.resolve(__dirname, "../../ui");
const entryFile = path.resolve(clientDir, "./public/index.html");
const outDir = path.resolve(clientDir, "dist");
const outFile = path.resolve(outDir, "index.html");

const generateComponentFileContents = async (
  componentsPath: string,
): Promise<string> => {
  const componentImports = await findComponentImports(
    clientDir,
    componentsPath,
  );

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

export const start = async (componentsPath: string, port: number = 3000) => {
  const app = Express();

  // const componentsOutDir = path.resolve(clientDir);
  const componentsGeneratedPath = path.resolve(
    clientDir,
    "components-generated.ts",
  );
  // const importPath = path.relative(
  //   componentsOutDir,
  //   path.resolve(process.cwd(), componentsPath),
  // );

  const generatedFileContents = await generateComponentFileContents(
    componentsPath,
  );

  console.log(generatedFileContents);

  fs.writeFileSync(componentsGeneratedPath, generatedFileContents);

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
