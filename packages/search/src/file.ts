import {File, FileError, FileExport} from "./types";
import {findProdoCommentLines, getImportPath} from "./utils";

export type ExtractFunction = (
  line: string,
  filepath: string,
) => FileExport | FileError;

const getProdoExport = (
  filepath: string,
  contents: string,
  lineNumber: number,
  extractExport: ExtractFunction,
): FileExport | FileError => {
  const lines = contents.split("\n");
  const lineAfter = lines[lineNumber + 1];
  return extractExport(lineAfter, filepath);
};

export const findFileExports = (
  filepath: string,
  contents: string,
  annotationRegex: RegExp,
  extractExport: ExtractFunction,
): Array<FileExport | FileError> => {
  const found = findProdoCommentLines(contents, annotationRegex);
  return found.map(lineNumber =>
    getProdoExport(filepath, contents, lineNumber, extractExport),
  );
};

export const getFile = ({
  contents,
  filepath,
  annotationRegex,
  extractExport,
}: {
  contents: string;
  filepath: string;
  annotationRegex: RegExp;
  extractExport: ExtractFunction;
}): File | null => {
  const result = findFileExports(
    filepath,
    contents,
    annotationRegex,
    extractExport,
  );
  if (result.length > 0) {
    const fileExports = result.filter(
      e => !(e instanceof FileError),
    ) as FileExport[];
    const errors = result.filter(e => e instanceof FileError) as FileError[];
    return {
      filepath: getImportPath(filepath),
      fileExports,
      errors,
    };
  }

  return null;
};
