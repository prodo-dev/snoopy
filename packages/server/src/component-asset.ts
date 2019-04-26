import {generateComponentsFileContents} from "./generate";
import * as path from "path";

import TypeScriptAsset = require("parcel-bundler/lib/assets/TypeScriptAsset");

class MyAsset extends TypeScriptAsset {
  public async generate() {
    if (this.basename === "components.ts") {
      const fileDir = path.dirname(this.name);
      console.log("Getting file contents");
      const fileContents = await generateComponentsFileContents(fileDir);
      this.contents = fileContents;
      return [{type: "js", value: fileContents}];
    }

    return super.generate();
  }
}

module.exports = MyAsset;
