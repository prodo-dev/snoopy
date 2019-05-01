import * as path from "path";
import {ExtractFunction, getFile} from "./file";
import {File, FileError} from "./types";
import {capitalize, exportDefaultRegex, indexFileRegex} from "./utils";

const prodoCommentRegex = /^\/\/\s*@prodo\b/;

const exportComponentRegex = /\bexport\s+(?:(?:const|class)\s+)?([A-Z]\w+)/;

const extractComponent: ExtractFunction = (line, filepath) => {
  const match = exportComponentRegex.exec(line);
  if (match) {
    return {
      name: match[1],
      isDefaultExport: false,
    };
  }

  if (exportDefaultRegex.test(line)) {
    if (indexFileRegex.test(filepath)) {
      return {
        name: capitalize(path.basename(path.dirname(filepath))),
        isDefaultExport: true,
      };
    }

    return {
      name: capitalize(path.basename(filepath, path.extname(filepath))),
      isDefaultExport: true,
    };
  }

  return new FileError(
    filepath,
    "The `@prodo` tag must be directly above an exported React component.",
  );
};

export const getComponentsFile = (
  contents: string,
  filepath: string,
): File | null => {
  return getFile({
    filepath,
    contents,
    annotationRegex: prodoCommentRegex,
    extractExport: extractComponent,
  });
};
