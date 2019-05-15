import * as findUp from "find-up";
import * as globby from "globby";
import * as multimatch from "multimatch";
import * as path from "path";
import {findComponentExports, findThemeExports} from "./parser";
import {getStylesFile} from "./styles";
import {ExtractType, File, FileError, SearchResult} from "./types";
import {fileGlob, readFileContents, styleFileGlob} from "./utils";

export * from "./types";

export const checkMatch = (filepath: string): boolean => {
  const gitDirectory = findUp.sync(".git", {type: "directory"});
  const cwd = gitDirectory && path.dirname(gitDirectory);
  const inGitIgnore = globby.gitignore.sync({cwd});
  return !inGitIgnore(filepath) && multimatch(filepath, fileGlob).length > 0;
};

const getNonNullFilesOfGivenType = (
  files: Array<{[id: string]: File | null}>,
  type: ExtractType,
) => {
  return files.map(i => i[type]).filter(i => i != null) as File[];
};

const getFiles = async (
  directoryToSearch: string,
  result: string[],
  extractors: {
    [id in ExtractType]?: (contents: string, filepath: string) => File | null
  },
) => {
  const files = await Promise.all(
    result.map(async file => {
      const filepath = path.resolve(directoryToSearch, file);

      let contents: string;
      const fileResult: {[id: string]: File | null} = {};
      try {
        contents = await readFileContents(filepath);
      } catch (e) {
        for (const id of Object.keys(extractors)) {
          fileResult[id] = {
            filepath,
            fileExports: [],
            errors: [new FileError(filepath, "Could not read the file.")],
          };
        }
        return fileResult;
      }

      for (const id of Object.keys(extractors) as ExtractType[]) {
        if (extractors[id]) {
          fileResult[id] = extractors[id]!(contents, filepath);
        }
      }
      return fileResult;
    }),
  );
  return files;
};

export const searchCodebase = async (
  directoryToSearch: string,
): Promise<SearchResult> => {
  const result = await globby(fileGlob, {
    cwd: directoryToSearch,
    gitignore: true,
  });
  const files = await getFiles(directoryToSearch, result, {
    componentFiles: findComponentExports,
    themeFiles: findThemeExports,
  });

  const styleResult = await globby(styleFileGlob, {
    cwd: directoryToSearch,
    gitignore: true,
  });
  const styleFiles = await getFiles(directoryToSearch, styleResult, {
    styleFiles: getStylesFile,
  });

  const results: SearchResult = {
    componentFiles: getNonNullFilesOfGivenType(files, "componentFiles"),
    themeFiles: getNonNullFilesOfGivenType(files, "themeFiles"),
    styleFiles: getNonNullFilesOfGivenType(styleFiles, "styleFiles"),
  };

  return results;
};
