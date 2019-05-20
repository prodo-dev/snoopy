import {findFileExports, mkExportVisitor} from "./exportVisitor";
import {File} from "./types";

const prodoComponentRegex = /^\s*@prodo(\s|$)/;
const componentVisitor = mkExportVisitor({
  lineRegex: prodoComponentRegex,
  invalidProdoTagError:
    "The `@prodo` tag must be directly above an exported React component.",
});

const prodoThemeRegex = /^\s*@prodo:theme\b/;
const themeVisitor = mkExportVisitor({
  lineRegex: prodoThemeRegex,
  invalidProdoTagError:
    "The `@prodo:theme` tag must be directly above an exported theme.",
});

const prodoFileRegex = /\/\/\s*@prodo/;
const isPossibleProdoFile = (code: string): boolean =>
  prodoFileRegex.test(code);

export const findComponentExports = (
  code: string,
  filepath: string,
): File | null => {
  if (!isPossibleProdoFile(code)) {
    return null;
  }

  return findFileExports(componentVisitor, code, filepath);
};

export const findThemeExports = (
  code: string,
  filepath: string,
): File | null => {
  if (!isPossibleProdoFile(code)) {
    return null;
  }

  return findFileExports(themeVisitor, code, filepath);
};
