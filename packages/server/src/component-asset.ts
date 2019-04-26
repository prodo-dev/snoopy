import TypeScriptAsset = require("parcel-bundler/lib/assets/TypeScriptAsset");
// import JSAsset = require("parcel-bundler/lib/assets/JSAsset");

const code = `
module.exports = require("./foo")

module.exports.components = [10000]
`.trim();

class MyAsset extends TypeScriptAsset {
  public async load() {
    if (this.basename === "components.ts") {
      console.log("Loading components.ts");
      return code;
    }

    return super.load();
  }

  // constructor(name: string, pkg: any, options: any) {
  //   super(name, pkg, options);
  //   // process.stderr.write(`\n${JSON.stringify(this.options, null, 2)}\n`);

  //   this.contents = 'export * from "./foo"';
  //   this.contents = `
  //   const foo = require("./foo.ts");
  //   module.exports = foo;
  //   `.trim();
  // }

  public async collectDependencies() {
    // console.log("\nCOLLECT DEPS\n");
    this.addDependency("./foo.ts");
  }

  public async parse(code: string) {
    process.stderr.write(`\nCODE: ${code}\n`);
    super.parse(code);
  }

  public async generate() {
    if (this.basename === "components.ts") {
      this.contents = code;
      this.opts = {
        ...this.opts,
        sourceMaps: false,
      };
      return [{type: "js", value: code}];
    }

    return super.generate();
  }

  // public async generate() {
  //   console.log(this.contents);
  //   return [
  //     {
  //       type: "js",
  //       value: this.contents,
  //     },
  //   ];
  // }
}

module.exports = MyAsset;
