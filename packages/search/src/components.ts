import * as path from "path";
import {Export, FileError, Import} from "./types";
import {
  capitalize,
  exportDefaultRegex,
  findProdoCommentLines,
  getImportPath,
  indexFileRegex,
} from "./utils";

const prodoCommentRegex = /^\/\/\s*@prodo\b/;

const isProdoComponentLine = (line: string): boolean =>
  prodoCommentRegex.test(line);

const exportComponentRegex = /\bexport\s+(?:const\s+)?([A-Z]\w+)/;

const getProdoExport = (
  filepath: string,
  contents: string,
  lineNumber: number,
): Export | FileError => {
  const lines = contents.split("\n");
  const lineAfter = lines[lineNumber + 1];

  const match = exportComponentRegex.exec(lineAfter);
  if (match) {
    return {
      name: match[1],
      defaultExport: false,
    };
  }

  if (exportDefaultRegex.test(lineAfter)) {
    if (indexFileRegex.test(filepath)) {
      return {
        name: capitalize(path.basename(path.dirname(filepath))),
        defaultExport: true,
      };
    }

    return {
      name: capitalize(path.basename(filepath, path.extname(filepath))),
      defaultExport: true,
    };
  }

  return new FileError(
    filepath,
    "The `@prodo` tag must be directly above an exported React component.",
  );
};

export const findComponentExports = (
  filepath: string,
  contents: string,
): Array<Export | FileError> => {
  const found = findProdoCommentLines(contents, isProdoComponentLine);
  return found.map(lineNumber =>
    getProdoExport(filepath, contents, lineNumber),
  );
};

export const getComponentImportsForFile = (
  cwd: string,
  contents: string,
  filepath: string,
): Import | null => {
  const result = findComponentExports(filepath, contents);
  if (result.length > 0) {
    const componentExports = result.filter(
      e => !(e instanceof FileError),
    ) as Export[];
    const errors = result.filter(e => e instanceof FileError) as FileError[];
    return {
      filepath: getImportPath(cwd, filepath),
      fileExports: componentExports,
      errors,
    };
  }

  return null;
};
