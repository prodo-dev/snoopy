import * as glob from "glob";
import {promisify} from "util";
import * as path from "path";
import * as fs from "fs";
import {matchAll} from "./regex";
import {ComponentImport} from "./types";

const prodoCommentString = "// @prodo";
const fileExtensions = ["ts", "tsx", "js", "jsx"];

export const fileFilter = (filepath: string): boolean =>
  fileExtensions.includes(path.extname(filepath));

const readFileContents = (filepath: string): Promise<string> =>
  promisify(fs.readFile)(filepath).then(buffer => buffer.toString());

const isProdoComponentLine = (line: string): boolean =>
  line.indexOf(prodoCommentString) >= 0;

const findProdoCommentLines = (contents: string): number[] =>
  contents
    .split("\n")
    .reduce(
      (found: number[], line: string, idx: number) =>
        isProdoComponentLine(line) ? found.concat(idx) : found,
      [],
    );

const exportMatch = matchAll(/export const ([A-Z]\w+)/gm);
const getExportName = (contents: string, lineNumber: number): string => {
  const lines = contents.split("\n");

  const lineAfter = lines[lineNumber + 1];
  const exportName = exportMatch(lineAfter)[1];

  return exportName;
};

const indexFileRegex = new RegExp(`/\index.(${fileExtensions.join("|")})$`);
const getImportPath = (cwd: string, filepath: string): string => {
  const newPath = filepath.replace(indexFileRegex, "");
  const relativePath = path.relative(cwd, newPath);
  return relativePath;
};

export const findComponentImports = async (
  cwd: string,
  searchPath: string,
): Promise<ComponentImport[]> => {
  const result = await promisify(glob)(`**/*.{${fileExtensions.join(",")}}`, {
    cwd: searchPath,
  });

  const imports: ComponentImport[] = [];
  for (const file of result) {
    const filepath = path.resolve(searchPath, file);
    const contents = await readFileContents(filepath);

    const found = findProdoCommentLines(contents);
    const exportNames = found.map(lineNumber =>
      getExportName(contents, lineNumber),
    );

    if (exportNames.length > 0) {
      const componentImport: ComponentImport = {
        filepath: getImportPath(cwd, filepath),
        exportNames,
      };

      imports.push(componentImport);
    }
  }

  return imports;
};
