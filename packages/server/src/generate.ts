import {searchCodebase} from "@prodo/snoopy-search";
import * as _ from "lodash";
import * as path from "path";

export const generateComponentsFileContents = async (
  clientDir: string,
  searchDir: string,
): Promise<string> => {
  const imports = await searchCodebase(searchDir);

  let componentCounter = 0;
  const componentFiles = _.sortBy(imports.componentFiles, "filepath").map(
    file => ({
      ...file,
      fileExports: _.sortBy(file.fileExports, "name").map(ex => ({
        ...ex,
        id: `Component${componentCounter++}`,
      })),
    }),
  );

  let themeCounter = 0;
  const themeFiles = _.sortBy(imports.themeFiles, "filepath").map(file => ({
    ...file,
    fileExports: _.sortBy(file.fileExports, "name").map(ex => ({
      ...ex,
      id: `Theme${themeCounter++}`,
    })),
  }));

  const importsByFile: {
    [path: string]: {
      defaultImport?: string;
      namedImports: Array<{from: string; to: string}>;
    };
  } = {};

  componentFiles.concat(themeFiles).forEach(({filepath, fileExports}) => {
    if (importsByFile[filepath] == null) {
      importsByFile[filepath] = {
        namedImports: [] as Array<{from: string; to: string}>,
      };
    }
    fileExports.forEach(ex => {
      if (ex.isDefaultExport) {
        if (importsByFile[filepath].defaultImport) {
          throw new Error("Duplicate default import detected.");
        }
        importsByFile[filepath].defaultImport = ex.id;
      } else {
        importsByFile[filepath].namedImports.push({from: ex.name, to: ex.id});
      }
    });
  });

  const importLines = _.sortBy(Object.keys(importsByFile))
    .map(filepath => {
      const {defaultImport, namedImports} = importsByFile[filepath];
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
        .join(",\n  "),
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
        .join(",\n  "),
    )
    .join(",\n  ");

  return `
${importLines}

import * as React from "react";
import * as ReactDOM from "react-dom";

export { React as UserReact, ReactDOM as UserReactDOM };

export let StyledComponents;
try {
  StyledComponents = require("styled-components");
} catch (e) {
  StyledComponents = null;
}

export const components = [
  ${componentsArrayString}
];

export const themes = [
  ${themesArrayString}
];
`.trimLeft();
};
