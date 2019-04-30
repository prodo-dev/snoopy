import * as fs from "fs";
import {promisify} from "util";

export const fileExtensions = ["ts", "tsx", "js", "jsx"];
export const fileGlob = `**/!(flycheck_*).{ts,tsx,js,jsx}`;

export const capitalize = (str: string): string =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const readFile = promisify(fs.readFile);
export const readFileContents = (filepath: string): Promise<string> =>
  readFile(filepath, "utf8");

export const findProdoCommentLines = (
  contents: string,
  testFunction: (line: string) => boolean,
): number[] =>
  contents
    .split("\n")
    .map((line, idx) => ({line, idx}))
    .filter(({line}) => testFunction(line))
    .map(({idx}) => idx);
