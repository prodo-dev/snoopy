import * as fs from "fs";
import {Asset} from "parcel-bundler";
import * as path from "path";

class MyAsset extends Asset {
  public type = "template"; // set the main output type.

  public async generate() {
    const componentPath = this.getComponentPath();
    return [
      {
        type: "js",
        value: `export * from "${componentPath}";`, // main output
      },
    ];
  }

  public readConfig(): any {
    const configFile = fs.readFileSync(
      path.resolve(process.cwd(), "prodo.json"),
      "utf-8",
    );
    return JSON.parse(configFile);
  }

  public getComponentPath(): string {
    const config = this.readConfig();
    return path.relative(
      path.dirname(this.name),
      path.join(process.cwd(), config.components),
    );
  }
}

module.exports = MyAsset;
