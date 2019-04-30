import {findImports} from "@prodo/snoopy-search";
import * as Express from "express";
import * as fs from "fs";
import * as Bundler from "parcel-bundler";
import * as path from "path";

const clientDir = path.resolve(__dirname, "../../ui");
const entryFile = path.resolve(clientDir, "./public/index.html");
const outDir = path.resolve(clientDir, "dist");
const outFile = path.resolve(outDir, "index.html");

const flat = Array.prototype.concat.bind([]);

const generateComponentFileContents = async (): Promise<string> => {
  const imports = await findImports(clientDir, process.cwd());
  console.log(imports);

  const componentsImportString = flat(
    imports.components.map(({filepath, exports}) =>
      exports.map(({name, defaultExport}) => {
        const importName = defaultExport ? name : `{ ${name} }`;
        return `import ${importName} from "${filepath}"`;
      }),
    ),
  ).join("\n");

  // TODO clean this up
  const themesImportString = imports.themes
    .map(({filepath, exports}) =>
      exports
        .map(({name, defaultExport}) => {
          const importName = defaultExport ? name : `{ ${name} }`;
          return `import ${importName} from "${filepath}";`;
        })
        .join("\n"),
    )
    .join("\n");
  console.log(themesImportString);

  const componentsArrayString = imports.components
    .map(({exports}) =>
      exports
        .map(({name}) => `{name: "${name}", component: ${name}}`)
        .join(","),
    )
    .join(",\n  ");

  const themesArrayString = imports.themes
    .map(({exports}) =>
      exports.map(({name}) => `{name: "${name}", theme: ${name}}`).join(","),
    )
    .join(",\n  ");

  return `
${componentsImportString};

${themesImportString};

export const components = [
  ${componentsArrayString}
];

export const themes = [
  ${themesArrayString}
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

  fs.watch(process.cwd(), {recursive: true}, () => {
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

  process.stdout.write(`Starting server on port ${port}...\n`);
  bundler.bundle();
  app.use(bundler.middleware());
  app.listen(3000);
};
