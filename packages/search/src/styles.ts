import {File} from "./types";
import {findProdoCommentLines} from "./utils";

const snoopyStylesCommentRegex = /^\/\*\s*@snoopy:styles\b/;

export const getStylesFile = (
  contents: string,
  filepath: string,
): File | null => {
  const found = findProdoCommentLines(contents, snoopyStylesCommentRegex);

  if (found.length > 0) {
    return {
      filepath,
      fileExports: [{name: "styles", isDefaultExport: false}],
      errors: [],
    };
  }
  return null;
};
