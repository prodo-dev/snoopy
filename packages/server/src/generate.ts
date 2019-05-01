import {searchCodebase} from "@prodo/snoopy-search";
import * as path from "path";

const flat = Array.prototype.concat.bind([]);

export const generateComponentsFileContents = async (
  clientDir: string,
  searchDir: string,
): Promise<string> => {
  const imports = await searchCodebase(searchDir);

  const importString = flat(
    imports.componentFiles
      .concat(imports.themeFiles)
      .map(({filepath, fileExports}) =>
        fileExports.map(({name, isDefaultExport}) => {
          const importName = isDefaultExport ? name : `{ ${name} }`;
          return `import ${importName} from "${path.relative(
            clientDir,
            filepath,
          )}";`;
        }),
      ),
  ).join("\n");

  const componentsArrayString = imports.componentFiles
    .map(({fileExports}) =>
      fileExports
        .map(({name}) => `{name: "${name}", component: ${name}}`)
        .join(","),
    )
    .join(",\n  ");

  const themesArrayString = imports.themeFiles
    .map(({fileExports}) =>
      fileExports
        .map(({name}) => `{name: "${name}", theme: ${name}}`)
        .join(","),
    )
    .join(",\n  ");

  return `
${importString};

export const components = [
  ${componentsArrayString}
];

export const themes = [
  ${themesArrayString}
];
`.trimLeft();
};
