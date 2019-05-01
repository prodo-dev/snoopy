import * as glob from "glob";
import * as minimatch from "minimatch";
import * as path from "path";
import {promisify} from "util";
import {getComponentsFile} from "./components";
import {getThemesFile} from "./themes";
import {File, FileError, SearchResult} from "./types";
import {fileGlob, readFileContents} from "./utils";

export const checkMatch = (filepath: string): boolean =>
  minimatch(filepath, fileGlob);

export const searchCodebase = async (
  relativeFrom: string,
  directoryToSearch: string,
): Promise<SearchResult> => {
  const result = await promisify(glob)(fileGlob, {
    cwd: directoryToSearch,
  });

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
        componentFiles: getComponentsFile(relativeFrom, contents, filepath),
        themeFiles: getThemesFile(relativeFrom, contents, filepath),
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
