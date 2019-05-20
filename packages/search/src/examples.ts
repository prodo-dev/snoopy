import * as fs from "fs";
import * as globby from "globby";
import * as path from "path";
import {promisify} from "util";
import {File} from "./types";
import {exampleFileGlob, findProjectRoot} from "./utils";

const exists = promisify(fs.exists);

export const examplesDirectoryName = "examples";

export const findExampleFilePaths = async (
  cwd: string = process.cwd(),
): Promise<string[]> => {
  const projectRoot = await findProjectRoot(cwd);

  if (projectRoot == null) {
    return [];
  }

  const prodoDir = path.resolve(projectRoot, examplesDirectoryName);
  const prodoDirExists = await exists(prodoDir);
  if (!prodoDirExists) {
    return [];
  }

  const exampleResult = await globby(exampleFileGlob, {
    cwd: prodoDir,
  });

  return exampleResult.map(f =>
    path.resolve(projectRoot, examplesDirectoryName, f),
  );
};

export const findExamples = async (
  cwd: string = process.cwd(),
): Promise<File[]> => {
  const exampleFilePaths = await findExampleFilePaths(cwd);

  return exampleFilePaths.map(f => ({
    filepath: f,
    fileExports: [],
    errors: [],
  }));
};
