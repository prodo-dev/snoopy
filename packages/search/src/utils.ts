import * as fs from "fs";
import {promisify} from "util";

export const fileExtensions = ["ts", "tsx", "js", "jsx"];
export const fileGlob = [
  `**/*.{${fileExtensions.join(",")}}`,
  "!flycheck_*.*",
  "!node_modules/**/*",
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
