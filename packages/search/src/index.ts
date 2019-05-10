import * as globby from "globby";
import * as multimatch from "multimatch";
import * as path from "path";
import {findComponentExports, findThemeExports} from "./parser";
import {File, FileError, SearchResult} from "./types";
import {fileGlob, readFileContents} from "./utils";

export * from "./types";

export const checkMatch = (filepath: string): boolean =>
  multimatch(filepath, fileGlob).length > 0;

export const searchCodebase = async (
  directoryToSearch: string,
): Promise<SearchResult> => {
  const result = await globby(fileGlob, {cwd: directoryToSearch});

  const files = await Promise.all(
    result.map(async file => {
      const filepath = path.resolve(directoryToSearch, file);

      let contents: string;
      try {
        contents = await readFileContents(filepath);
      } catch (e) {
        const erroredImport = {
          filepath,
          fileExports: [],
          errors: [new FileError(filepath, "Could not read the file.")],
        };
        return {
          componentFiles: erroredImport,
          themeFiles: erroredImport,
        };
      }

      return {
        componentFiles: findComponentExports(contents, filepath),
        themeFiles: findThemeExports(contents, filepath),
      };
    }),
  );

  const results: SearchResult = {
    componentFiles: files
      .map(i => i.componentFiles)
      .filter(i => i != null) as File[],
    themeFiles: files.map(i => i.themeFiles).filter(i => i != null) as File[],
  };
  return results;
};
