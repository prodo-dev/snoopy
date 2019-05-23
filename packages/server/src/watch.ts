import {checkMatch} from "@prodo-ai/snoopy-search";
import * as chokidar from "chokidar";
import {generateComponentsFileContents} from "./generate";

export const watchComponentsFile = async (
  cwd: string,
  onComponentsFileChange: () => void,
) => {
  let generated = await generateComponentsFileContents(".", cwd);

  chokidar
    .watch(".", {
      cwd,
      ignoreInitial: true,
      ignored: /node_modules|\.git|flycheck_*/,
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
