import * as path from "path";
import {generateComponentsFileContents, generateLibs} from "./generate";

// tslint:disable-next-line:no-submodule-imports
import TypeScriptAsset = require("parcel-bundler/src/assets/TypeScriptAsset");

const componentsFileRegex = /@prodo\/components\/index\.ts$/;
const libsFileRegex = /@prodo\/components\/lib.ts$/;

class ComponentAsset extends TypeScriptAsset {
  public async load() {
    if (componentsFileRegex.test(this.name)) {
      const fileDir = path.dirname(this.name);
      this.contents = await generateComponentsFileContents(
        fileDir,
        this.options.env.PRODO_SEARCH_DIRECTORY,
      );

      return this.contents;
    } else if (libsFileRegex.test(this.name)) {
      this.contents = generateLibs();
      return this.contents;
    }

    return super.load();
  }
}

module.exports = ComponentAsset;
