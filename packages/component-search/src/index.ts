import * as fs from "fs";
import * as glob from "glob";
import * as minimatch from "minimatch";
import * as path from "path";
import {promisify} from "util";
import {ComponentImport, Export, FileError} from "./types";

const prodoCommentRegex = /^\/\/\s*@prodo\b/;
export const fileExtensions = ["ts", "tsx", "js", "jsx"];
export const fileGlob = `**/!(flycheck_*).{ts,tsx,js,jsx}`;
export const checkMatch = (filepath: string): boolean =>
  minimatch(filepath, fileGlob);

const capitalize = (str: string): string =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const readFile = promisify(fs.readFile);
const readFileContents = (filepath: string): Promise<string> =>
  readFile(filepath, "utf8");

const isProdoComponentLine = (line: string): boolean =>
  prodoCommentRegex.test(line);

const findProdoCommentLines = (contents: string): number[] =>
  contents
    .split("\n")
    .map((line, idx) => ({line, idx}))
    .filter(({line}) => isProdoComponentLine(line))
    .map(({idx}) => idx);

const exportRegex = /\bexport\s+(?:(?:const|class)\s+)?([A-Z]\w+)/;
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
    if (indexFileRegex.test(filepath)) {
      return {
        name: capitalize(path.basename(path.dirname(filepath))),
        defaultExport: true,
      };
    }

    return {
      name: capitalize(path.basename(filepath, path.extname(filepath))),
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

// Removes unnecessary "/index" prefixes
const getImportPath = (filepath: string): string =>
  filepath.replace(indexFileRegex, "");

export const getComponentImportsForFile = (
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
      filepath: getImportPath(filepath),
      componentExports,
      errors,
    };
  }

  return null;
};

export const findComponentImports = async (
  searchPath: string,
): Promise<ComponentImport[]> => {
  const result = await promisify(glob)(fileGlob, {
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

      return getComponentImportsForFile(contents, filepath);
    }),
  );

  return imports.filter(i => i != null) as ComponentImport[];
};
