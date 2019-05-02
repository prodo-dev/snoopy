import {ExtractFunction, getFile} from "./file";
import {File, FileError} from "./types";
import {exportDefaultRegex} from "./utils";

const prodoThemeCommentRegex = /^\/\/\s*@prodo:theme\b/;

const exportAnyRegex = /\bexport\s+(?:const\s+)?(\w+)/;

const extractTheme: ExtractFunction = (line, filepath) => {
  if (exportDefaultRegex.test(line)) {
    return {
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
