import {searchCodebase} from "@prodo/snoopy-search";
import * as path from "path";

export const generateComponentsFileContents = async (
  clientDir: string,
  searchDir: string,
): Promise<string> => {
  const imports = await searchCodebase(searchDir);

  let componentCounter = 0;
  const componentFiles = imports.componentFiles.map(file => ({
    ...file,
    fileExports: file.fileExports.map(ex => ({
      ...ex,
      id: `Component${componentCounter++}`,
    })),
  }));
  let themeCounter = 0;
  const themeFiles = imports.themeFiles.map(file => ({
    ...file,
    fileExports: file.fileExports.map(ex => ({
      ...ex,
      id: `Theme${themeCounter++}`,
    })),
  }));

  const importLines = componentFiles
    .concat(themeFiles)
    .map(({filepath, fileExports}) => {
      let defaultImport: string | undefined;
      const namedImports: Array<{from: string; to: string}> = [];
      fileExports.forEach(ex => {
        if (ex.isDefaultExport) {
          defaultImport = ex.id;
        } else {
          namedImports.push({from: ex.name, to: ex.id});
        }
      });
      return `import ${[
        defaultImport,
        namedImports.length > 0
          ? `{${namedImports
              .map(({from, to}) => `${from} as ${to}`)
              .join(", ")}}`
          : undefined,
      ]
        .filter(x => x != null)
        .join(", ")} from "${path.relative(clientDir, filepath)}";`;
    })
    .join("\n");

  const componentsArrayString = componentFiles
    .map(({filepath, fileExports}) =>
      fileExports
        .map(
          ex =>
            `{path: "${path.relative(searchDir, filepath)}", name: "${
              ex.isDefaultExport ? "default" : ex.name
            }", component: ${ex.id}}`,
        )
        .join(","),
    )
    .join(",\n  ");

  const themesArrayString = themeFiles
    .map(({filepath, fileExports}) =>
      fileExports
        .map(
          ex =>
            `{path: "${path.relative(searchDir, filepath)}", name: "${
              ex.isDefaultExport ? "default" : ex.name
            }", theme: ${ex.id}}`,
        )
        .join(","),
    )
    .join(",\n  ");

  return `
${importLines}

export const components = [
  ${componentsArrayString}
];

export const themes = [
  ${themesArrayString}
];
`.trimLeft();
};
