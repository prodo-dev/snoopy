import {checkMatch} from "@prodo-ai/snoopy-search";
// tslint:disable-next-line:no-submodule-imports
import {ignored} from "@prodo-ai/snoopy-search/src/utils";
import * as chokidar from "chokidar";
import {generateComponentsFileContents} from "./generate";

export const watchForComponentsFileChanges = async (
  cwd: string,
  onComponentsFileChange: () => void,
): Promise<chokidar.FSWatcher> => {
  let generated = await generateComponentsFileContents(".", cwd);

  return chokidar
    .watch(".", {
      cwd,
      ignoreInitial: true,
      ignored,
    })
    .on("all", async (_, filename) => {
      try {
        const matches = await checkMatch(filename);
        if (matches) {
          const newGenerated = await generateComponentsFileContents(".", cwd);
          if (generated !== newGenerated) {
            generated = newGenerated;
            onComponentsFileChange();
          }
        }
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.warn("Error handling file change:", filename, "\n", e);
      }
    });
};
