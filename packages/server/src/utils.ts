import * as fs from "fs";
import {promisify} from "util";

export const writeFile = promisify(fs.writeFile);
export const stat = promisify(fs.stat);

export const exists = async (filePath: string): Promise<boolean> => {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
};
