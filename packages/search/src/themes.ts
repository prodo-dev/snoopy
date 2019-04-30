import * as path from "path";
import {Export, FileError, Import} from "./types";
import {findProdoCommentLines} from "./utils";

const prodoThemeCommentRegex = /^\/\/\s*@prodo:theme\b/;

const isProdoThemeComponentLine = (line: string): boolean =>
  prodoThemeCommentRegex.test(line);

const exportAnyRegex = /\bexport\s+(?:const\s+)?(\w+)/;

const getThemeExport = (
  filepath: string,
  contents: string,
  lineNumber: number,
): Export | FileError => {
  const lines = contents.split("\n");
  const lineAfter = lines[lineNumber + 1];

  const match = exportAnyRegex.exec(lineAfter);
  if (match) {
    return {
      name: match[1],
      defaultExport: false,
    };
  }

  return new FileError(
    filepath,
    "The `@prodo:theme` tag must be directly above an exported React component.",
  );
};

export const findThemeExports = (
  filepath: string,
  contents: string,
): Array<Export | FileError> => {
  const found = findProdoCommentLines(contents, isProdoThemeComponentLine);
  return found.map(lineNumber =>
    getThemeExport(filepath, contents, lineNumber),
  );
};

const getThemeImportPath = (cwd: string, filepath: string): string => {
  const newPath = path.join(
    path.dirname(filepath),
    path.basename(filepath, path.extname(filepath)),
  );
  return path.relative(cwd, newPath);
};

export const getThemeImportsForFile = (
  cwd: string,
  contents: string,
  filepath: string,
): Import | null => {
  const result = findThemeExports(filepath, contents);
  if (result.length > 0) {
    const themeExports = result.filter(
      e => !(e instanceof FileError),
    ) as Export[];
    const errors = result.filter(e => e instanceof FileError) as FileError[];
    return {
      filepath: getThemeImportPath(cwd, filepath),
      fileExports: themeExports,
      errors,
    };
  }

  return null;
};
