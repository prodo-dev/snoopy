import {
  File,
  FileError,
  FileExport,
  searchCodebase,
} from "@prodo-ai/snoopy-search";
import * as fs from "fs";
import * as path from "path";

type FileExportWithId = FileExport & {id: string};

interface FileWithExportId extends File {
  fileExports: FileExportWithId[];
}

const by = <T>(transform: (a: T) => string) => (a: T, b: T) =>
  transform(a).localeCompare(transform(b));

const sortFileExports = (fileExports: FileExport[]): FileExport[] => {
  const defaultExports = fileExports.filter(ex => ex.isDefaultExport);
  const namedExports = fileExports.filter(ex => !ex.isDefaultExport);

  return defaultExports.concat(namedExports.sort(by((ex: any) => ex.name)));
};

const addFileExportIds = (files: File[], name: string): FileWithExportId[] => {
  let counter = 0;
  return files.sort(by(f => f.filepath)).map(file => ({
    ...file,
    fileExports: sortFileExports(file.fileExports).map(ex => ({
      ...ex,
      id: `${name}${counter++}`,
    })),
  }));
};

const sortFileErrors = (fileErrors: FileError[]): FileError[] =>
  fileErrors.sort(by(err => err.message));

const getDefaultName = (filepath: string): string => {
  const basename = path.basename(filepath, path.extname(filepath));
  if (basename === "index") {
    return path.basename(path.dirname(filepath));
  }

  return basename;
};

const generateNamedAndDefaultImports = (
  files: FileWithExportId[],
  clientDir: string,
): string => {
  const importsByFile: {
    [path: string]: {
      defaultImport?: string;
      namedImports: Array<{from: string; to: string}>;
    };
  } = {};

  files.forEach(({filepath, fileExports}) => {
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

  return importLines;
};

const generateComponentsArray = (
  files: FileWithExportId[],
  searchDir: string,
): string =>
  files
    .filter(({fileExports}) => fileExports.length > 0)
    .map(({filepath, fileExports}) =>
      fileExports
        .map(
          ex =>
            `{path: "${path.relative(searchDir, filepath)}", name: "${
              ex.isDefaultExport ? getDefaultName(filepath) : ex.name
            }", component: ${ex.id}}`,
        )
        .join(",\n  "),
    )
    .join(",\n  ");

const generateThemeArray = (files: FileWithExportId[], searchDir: string) =>
  files
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

const generateComponentErrors = (
  componentErrors: Array<{filepath: string; errors: FileError[]}>,
  searchDir: string,
) =>
  componentErrors
    .filter(({errors}) => errors.length > 0)
    .map(
      ({filepath, errors}) =>
        `{path: "${path.relative(searchDir, filepath)}": errors: [${errors
          .map(e => JSON.stringify(e.message))
          .join(",\n  ")}]}`,
    )
    .join(",\n  ");

const generateStylesArray = (files: File[], searchDir: string): string =>
  files
    .map(({filepath, fileExports}) =>
      fileExports
        .map(ex => {
          const contents = fs.readFileSync(filepath, "utf8");
          return `{path: "${path.relative(searchDir, filepath)}", name: "${
            ex.isDefaultExport ? "default" : ex.name
          }", style: \`${contents}\`}`;
        })
        .join(",\n  "),
    )
    .join(",\n  ");

const generateExamplesArray = (files: FileWithExportId[]): string =>
  files
    .map(({fileExports}) => {
      const defaultExport = fileExports.filter(ex => ex.isDefaultExport)[0];
      const namedExports = fileExports.filter(ex => !ex.isDefaultExport);
      const generateSingleExample = (ex: FileExportWithId): string => {
        const source = ex.source ? JSON.stringify(ex.source) : undefined;
        const title = ex.isDefaultExport ? "default" : ex.name;
        return `{component: ${ex.id}, title: "${title}", source: ${source}}`;
      };

      return `{forComponent: ${
        defaultExport.id
      }, examples: [\n    ${namedExports
        .map(generateSingleExample)
        .join(",\n    ")}\n  ]}`;
    })
    .join(",\n  ");

export const generateComponentsFileContents = async (
  clientDir: string,
  searchDir: string,
): Promise<string> => {
  const imports = await searchCodebase(searchDir);

  // Add unique ids to files and exports
  const componentFiles = addFileExportIds(imports.componentFiles, "Component");
  const componentErrors = imports.componentFiles
    .sort(by(f => f.filepath))
    .map(file => ({
      filepath: file.filepath,
      errors: sortFileErrors(file.errors),
    }));
  const themeFiles = addFileExportIds(imports.themeFiles, "Theme");
  const exampleFiles = addFileExportIds(imports.examples, "Example");

  // Generate required imports
  const importLines = generateNamedAndDefaultImports(
    [...componentFiles, ...themeFiles, ...exampleFiles],
    clientDir,
  );

  // Generate exported array content
  const componentsArrayString = generateComponentsArray(
    componentFiles,
    searchDir,
  );
  const componentErrorsString = generateComponentErrors(
    componentErrors,
    searchDir,
  );
  const themesArrayString = generateThemeArray(themeFiles, searchDir);
  const stylesArrayString = generateStylesArray(imports.styleFiles, searchDir);
  const examplesArrayString = generateExamplesArray(exampleFiles);

  return `
${importLines}

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
]:

export const examples = [
  ${examplesArrayString}
];
`.trimLeft();
};

export const generateLibsFile = (): string =>
  `
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
`.trim();
