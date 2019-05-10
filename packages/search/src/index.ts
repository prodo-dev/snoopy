import * as globby from "globby";
import * as multimatch from "multimatch";
import * as path from "path";
import {getComponentsFile} from "./components";
import {getStylesFile} from "./styles";
import {getThemesFile} from "./themes";
import {File, FileError, SearchResult} from "./types";
import {fileGlob, readFileContents, styleFileGlob} from "./utils";

export * from "./types";

export const checkMatch = (filepath: string): boolean =>
  multimatch(filepath, fileGlob).length > 0;

const getFiles = async (
  directoryToSearch: string,
  result: string[],
  extractors: {
    [id: string]: (contents: string, filepath: string) => File | null;
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

      for (const id of Object.keys(extractors)) {
        fileResult[id] = extractors[id](contents, filepath);
      }
      return fileResult;
    }),
  );
  return files;
};

export const searchCodebase = async (
  directoryToSearch: string,
): Promise<SearchResult> => {
  const result = await globby(fileGlob, {cwd: directoryToSearch});
  const files = await getFiles(directoryToSearch, result, {
    componentFiles: getComponentsFile,
    themeFiles: getThemesFile,
  });

  const styleResult = await globby(styleFileGlob, {cwd: directoryToSearch});
  const styleFiles = await getFiles(directoryToSearch, styleResult, {
    styleFiles: getStylesFile,
  });

  const results: SearchResult = {
    componentFiles: files
      .map(i => i.componentFiles)
      .filter(i => i != null) as File[],
    themeFiles: files.map(i => i.themeFiles).filter(i => i != null) as File[],
    styleFiles: styleFiles
      .map(i => i.styleFiles)
      .filter(i => i != null) as File[],
  };
  return results;
};
