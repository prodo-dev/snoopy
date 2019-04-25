import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import {promisify} from "util";
import {ComponentImport, Export, FileError} from "./types";

const prodoCommentRegex = /\/\/\s*@prodo/;
const fileExtensions = ["ts", "tsx", "js", "jsx"];

export const fileFilter = (filepath: string): boolean =>
  fileExtensions.includes(path.extname(filepath));

const readFileContents = (filepath: string): Promise<string> =>
  promisify(fs.readFile)(filepath, "utf8");

const isProdoComponentLine = (line: string): boolean =>
  line.match(prodoCommentRegex) != null;

const findProdoCommentLines = (contents: string): number[] =>
  contents
    .split("\n")
    .reduce(
      (found: number[], line: string, idx: number) =>
        isProdoComponentLine(line) ? found.concat(idx) : found,
      [],
    );

const exportRegex = /\bexport\s+(?:const\s+)?([A-Z]\w+)/;
const exportDefaultRegex = /\bexport\s+default\b/;
const indexFileRegex = new RegExp(`/\index.(${fileExtensions.join("|")})$`);

const getExport = (
  filepath: string,
  contents: string,
  lineNumber: number,
): Export | FileError => {
  const lines = contents.split("\n");
  const lineAfter = lines[lineNumber + 1];

  const match = exportRegex.exec(lineAfter);
  if (match) {
    return {
      name: match[1],
      defaultExport: false,
    };
  }

  if (exportDefaultRegex.test(lineAfter)) {
    if (filepath.match(indexFileRegex)) {
      return {name: path.basename(path.dirname(filepath)), defaultExport: true};
    }

    return {
      name: path.basename(filepath, path.extname(filepath)),
      defaultExport: true,
    };
  }

  return new FileError(
    filepath,
    "The `@prodo` tag must be directly above an exported React component.",
  );
};

export const findExports = (
  filepath: string,
  contents: string,
): Array<Export | FileError> => {
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
  const result = findExports(filepath, contents);
  if (result.length > 0) {
    const componentExports = result.filter(
      e => !(e instanceof FileError),
    ) as Export[];
    const errors = result.filter(e => e instanceof FileError) as FileError[];
    return {
      filepath: getImportPath(cwd, filepath),
      componentExports,
      errors,
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

      let contents: string;
      try {
        contents = await readFileContents(filepath);
      } catch (e) {
        return {
          filepath,
          componentExports: [],
          errors: [new FileError(filepath, "Could not read the file.")],
        };
      }

      return getComponentImportsForFile(cwd, contents, filepath);
    }),
  );

  return imports.filter(i => i != null) as ComponentImport[];
};
