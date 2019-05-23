import {findFileExports, mkExportVisitor} from "./exportVisitor";
import {File} from "./types";

const snoopyComponentRegex = /^\s*@snoopy(\s|$)/;
const componentVisitor = mkExportVisitor({
  lineRegex: snoopyComponentRegex,
  invalidProdoTagError:
    "The `@snoopy` tag must be directly above an exported React component.",
});

const snoopyComponentIgnoreRegex = /^\s*@snoopy:ignore\b/;
const componentIgnoreVisitor = mkExportVisitor({
  lineRegex: snoopyComponentIgnoreRegex,
  invalidProdoTagError:
    "The `@snoopy:ignore` tag must be directly above an exported React component.",
});

const snoopyThemeRegex = /^\s*@snoopy:theme\b/;
const themeVisitor = mkExportVisitor({
  lineRegex: snoopyThemeRegex,
  invalidProdoTagError:
    "The `@snoopy:theme` tag must be directly above an exported theme.",
});

const snoopyFileRegex = /\/\/\s*@snoopy/;
const isPossibleProdoFile = (code: string): boolean =>
  snoopyFileRegex.test(code);

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

export const findIgnoredExports = (
  code: string,
  filepath: string,
): File | null => {
  if (!isPossibleProdoFile(code)) {
    return null;
  }

  return findFileExports(componentIgnoreVisitor, code, filepath);
};
