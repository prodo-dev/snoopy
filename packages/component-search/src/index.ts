import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import {promisify} from "util";
import {matchAll} from "./regex";
import {ComponentImport, Export} from "./types";

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
const indexFileRegex = new RegExp(`/\index.(${fileExtensions.join("|")})$`);

const getExport = (
  filepath: string,
  contents: string,
  lineNumber: number,
): Export => {
  const lines = contents.split("\n");
  const lineAfter = lines[lineNumber + 1];

  if (!lineAfter.match(/\bdefault\b/)) {
    return {
      name: exportMatch(lineAfter)[1],
      defaultExport: false,
    };
  }

  if (filepath.match(indexFileRegex)) {
    return {name: path.basename(path.dirname(filepath)), defaultExport: true};
  }

  return {
    name: path.basename(filepath, path.extname(filepath)),
    defaultExport: true,
  };
};

export const findExports = (filepath: string, contents: string): Export[] => {
  const found = findProdoCommentLines(contents);
  return found.map(lineNumber => getExport(filepath, contents, lineNumber));
};

const getImportPath = (cwd: string, filepath: string): string => {
  const newPath = filepath.replace(indexFileRegex, "");
  return path.relative(cwd, newPath);
};

export const getComponentImportsForFile = (
  cwd: string,
  contents: string,
  filepath: string,
): ComponentImport | null => {
  const componentExports = findExports(filepath, contents);
  if (componentExports.length > 0) {
    return {
      filepath: getImportPath(cwd, filepath),
      componentExports,
    };
  }

  return null;
};

export const findComponentImports = async (
  cwd: string,
  searchPath: string,
): Promise<ComponentImport[]> => {
  const result = await promisify(glob)(`**/*.{${fileExtensions.join(",")}}`, {
    cwd: searchPath,
  });

  const imports = await Promise.all(
    result.map(async file => {
      const filepath = path.resolve(searchPath, file);
      const contents = await readFileContents(filepath);
      return getComponentImportsForFile(cwd, contents, filepath);
    }),
  );

  return imports.filter(i => i != null) as ComponentImport[];
};
