import {FileError, FileExport, searchCodebase} from "@prodo-ai/snoopy-search";
import * as fs from "fs";
import * as path from "path";

const by = <T>(transform: (a: T) => string) => (a: T, b: T) =>
  transform(a).localeCompare(transform(b));

const sortFileExports = (fileExports: FileExport[]): FileExport[] => {
  const defaultExports = fileExports.filter(ex => ex.isDefaultExport);
  const namedExports = fileExports.filter(ex => !ex.isDefaultExport);

  return defaultExports.concat(namedExports.sort(by((ex: any) => ex.name)));
};

const sortFileErrors = (fileErrors: FileError[]): FileError[] =>
  fileErrors.sort(by(err => err.message));

export const generateComponentsFileContents = async (
  clientDir: string,
  searchDir: string,
): Promise<string> => {
  const imports = await searchCodebase(searchDir);

  let componentCounter = 0;
  const componentFiles = imports.componentFiles
    .sort(by(f => f.filepath))
    .map(file => ({
      ...file,
      fileExports: sortFileExports(file.fileExports).map(ex => ({
        ...ex,
        id: `Component${componentCounter++}`,
      })),
    }));

  const componentErrors = imports.componentFiles
    .sort(by(f => f.filepath))
    .map(file => ({
      filepath: file.filepath,
      errors: sortFileErrors(file.errors),
    }));

  let themeCounter = 0;
  const themeFiles = imports.themeFiles.sort(by(f => f.filepath)).map(file => ({
    ...file,
    fileExports: sortFileExports(file.fileExports).map(ex => ({
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
    if (fileExports.length === 0) {
      return;
    }

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

  const importLines = Object.keys(importsByFile)
    .sort()
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
    .filter(({fileExports}) => fileExports.length > 0)
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

  const componentErrorsString = componentErrors
    .filter(({errors}) => errors.length > 0)
    .map(
      ({filepath, errors}) =>
        `{path: "${path.relative(searchDir, filepath)}": errors: [${errors
          .map(e => JSON.stringify(e.message))
          .join(",\n  ")}]}`,
    )
    .join(",\n  ");

  const themesArrayString = themeFiles
    .filter(({fileExports}) => fileExports.length > 0)
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

  const stylesArrayString = imports.styleFiles
    .map(({filepath, fileExports}) =>
      fileExports
        .map(ex => {
          const contents = fs.readFileSync(
            path.resolve(path.relative(searchDir, filepath)),
            "utf8",
          );
          return `{path: "${path.relative(searchDir, filepath)}", name: "${
            ex.isDefaultExport ? "default" : ex.name
          }", style: \`${contents}\`}`;
        })
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

export let ReactRouterDOM;
try {
  ReactRouterDOM = require("react-router-dom");
} catch (e) {
  ReactRouterDOM = null;
}

export const components = [
  ${componentsArrayString}
];

export const errors = [
  ${componentErrorsString}
];

export const themes = [
  ${themesArrayString}
];

export const styles = [
  ${stylesArrayString}
]
`.trimLeft();
};
