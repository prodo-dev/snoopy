import * as path from "path";
import {generateComponentsFileContents} from "./generate";

// tslint:disable-next-line:no-submodule-imports
import TypeScriptAsset = require("parcel-bundler/lib/assets/TypeScriptAsset");

const COMPONENTS_FILE = "components.ts";

class ComponentAsset extends TypeScriptAsset {
  public async load() {
    if (this.basename === COMPONENTS_FILE) {
      const fileDir = path.dirname(this.name);
      this.contents = await generateComponentsFileContents(fileDir);
      return this.contents;
    }

    return super.load();
  }

  // public collectDependencies() {
  //   if (this.basename === COMPONENTS_FILE) {
  //     const watchPath = `${process.cwd()}/**/*.(ts|tsx|js|jsx)`;
  //     this.addDependency(watchPath, {includedInParent: true});
  //   }
  // }
}

module.exports = ComponentAsset;
