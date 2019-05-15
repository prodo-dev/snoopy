import * as findUp from "find-up";
import * as fs from "fs";
import * as path from "path";
import {promisify} from "util";

export const fileExtensions = ["ts", "tsx", "js", "jsx"];
export const fileGlob = [
  `**/*.{${fileExtensions.join(",")}}`,
  "!flycheck_*.*",
  "!node_modules/**/*",
  "!dist/**/*",
];
export const styleFileExtensions = ["css", "less"];
export const styleFileGlob = [
  `**/*.{${styleFileExtensions.join(",")}}`,
  "!flycheck_*.*",
  "!node_modules/**/*",
  "!dist/**/*",
];

export const exportDefaultRegex = /\bexport\s+default\b/;

export const capitalize = (str: string): string =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const readFile = promisify(fs.readFile);
export const readFileContents = (filepath: string): Promise<string> =>
  readFile(filepath, "utf8");

export const findProdoCommentLines = (
  contents: string,
  regex: RegExp,
): number[] =>
  contents
    .split("\n")
    .map((line, idx) => ({line, idx}))
    .filter(({line}) => regex.test(line))
    .map(({idx}) => idx);

export const findProjectRoot = async (
  cwd: string = process.cwd(),
): Promise<string | null> => {
  const pkgJson = await findUp("package.json", {cwd});
  return pkgJson != null ? path.dirname(pkgJson) : null;
};
