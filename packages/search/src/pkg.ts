import * as findUp from "find-up";
import * as fs from "fs";
import * as globby from "globby";
import * as path from "path";
import {promisify} from "util";
import {fileGlob} from "./utils";

const exists = promisify(fs.exists);

export const findProjectRoot = async (
  cwd: string = process.cwd(),
): Promise<string | null> => {
  const pkgJson = await findUp("package.json", {cwd});
  return pkgJson != null ? path.dirname(pkgJson) : null;
};

export const findExampleFiles = async (
  cwd: string = process.cwd(),
): Promise<string[]> => {
  const projectRoot = await findProjectRoot(cwd);

  if (projectRoot == null) {
    return [];
  }

  const prodoDir = path.resolve(projectRoot, ".prodo");
  const prodoDirExists = await exists(prodoDir);
  if (!prodoDirExists) {
    return [];
  }

  const exampleResult = await globby(fileGlob, {
    cwd: prodoDir,
  });

  return exampleResult.map(f => path.resolve(projectRoot, ".prodo", f));
};
