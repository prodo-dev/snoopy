import * as path from "path";
import {ExtractFunction, getFile} from "./file";
import {File, FileError} from "./types";
import {exportDefaultRegex, indexFileRegex} from "./utils";

const prodoThemeCommentRegex = /^\/\/\s*@prodo:theme\b/;

const exportAnyRegex = /\bexport\s+(?:const\s+)?(\w+)/;

const extractTheme: ExtractFunction = (line, filepath) => {
  if (exportDefaultRegex.test(line)) {
    if (indexFileRegex.test(filepath)) {
      return {
        name: path.basename(path.dirname(filepath)),
        isDefaultExport: true,
      };
    }

    return {
      name: "default",
      isDefaultExport: true,
    };
  }

  const match = exportAnyRegex.exec(line);
  if (match) {
    return {
      name: match[1],
      isDefaultExport: false,
    };
  }

  return new FileError(
    filepath,
    "The `@prodo:theme` tag must be directly above an exported theme.",
  );
};

export const getThemesFile = (
  contents: string,
  filepath: string,
): File | null => {
  return getFile({
    filepath,
    contents,
    annotationRegex: prodoThemeCommentRegex,
    extractExport: extractTheme,
  });
};
