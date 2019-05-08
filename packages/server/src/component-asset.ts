import * as path from "path";
import {generateComponentsFileContents} from "./generate";

// tslint:disable-next-line:no-submodule-imports
import TypeScriptAsset = require("parcel-bundler/src/assets/TypeScriptAsset");

const componentsFileRegex = /@prodo\/components\/index\.ts$/;

class ComponentAsset extends TypeScriptAsset {
  public async load() {
    if (componentsFileRegex.test(this.name)) {
      const fileDir = path.dirname(this.name);
      this.contents = await generateComponentsFileContents(
        fileDir,
        this.options.env.PRODO_SEARCH_DIRECTORY,
      );

      return this.contents;
    }

    return super.load();
  }
}

module.exports = ComponentAsset;
