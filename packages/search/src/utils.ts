import * as fs from "fs";
import * as path from "path";
import {promisify} from "util";

export const fileExtensions = ["ts", "tsx", "js", "jsx"];
export const fileGlob = `**/!(flycheck_*).{ts,tsx,js,jsx}`;
export const indexFileRegex = new RegExp(
  `/\index.(${fileExtensions.join("|")})$`,
);
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

export const getImportPath = (cwd: string, filepath: string): string => {
  const newPath = filepath.replace(indexFileRegex, "");
  return path.relative(cwd, newPath);
};
