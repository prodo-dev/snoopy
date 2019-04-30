import * as glob from "glob";
import * as minimatch from "minimatch";
import * as path from "path";
import {promisify} from "util";
import {getComponentImportsForFile} from "./components";
import {getThemeImportsForFile} from "./themes";
import {FileError, Imports} from "./types";
import {fileGlob, readFileContents} from "./utils";

export const checkMatch = (filepath: string): boolean =>
  minimatch(filepath, fileGlob);

export const findImports = async (
  cwd: string,
  searchPath: string,
): Promise<Imports> => {
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
        const erroredImport = {
          filepath,
          exports: [],
          errors: [new FileError(filepath, "Could not read the file.")],
        };
        return {
          components: erroredImport,
          themes: erroredImport,
        };
      }

      return {
        components: getComponentImportsForFile(cwd, contents, filepath),
        themes: getThemeImportsForFile(cwd, contents, filepath),
      };
    }),
  );

  const results = {
    components: imports.map(i => i.components).filter(i => i != null),
    themes: imports.map(i => i.themes).filter(i => i != null),
  };
  return results as Imports;
};
