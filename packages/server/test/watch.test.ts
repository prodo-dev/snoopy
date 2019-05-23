import {watchComponentsFile} from "../src/watch";
import * as tmp from "tmp";
import * as path from "path";
import * as makeDir from "make-dir";
import * as fs from "fs";
import * as chokidar from "chokidar";
import {promisify} from "util";

const writeFile = promisify(fs.writeFile);

let dir: tmp.DirResult;
let watcher: chokidar.FSWatcher;

const reactImport = `import * as React from "react";`;

const wait = async (delay: number) =>
  new Promise(resolve => setTimeout(resolve, delay));

const writeFileToPath = async (filepath: string, contents: string) => {
  const fullpath = path.join(dir.name, filepath);
  await makeDir(path.dirname(fullpath));
  await writeFile(fullpath, contents);
};

const writeSrcFile = async (contents: string) => {
  const filepath = "src/Button/index.ts";
  return writeFileToPath(
    filepath,
    `
${reactImport}

${contents}`,
  );
};

const writeExampleFile = async (contents: string) => {
  const filepath = "examples/Button.example.ts";
  return writeFileToPath(
    filepath,
    `
${reactImport}
import Button from "../src/Button";
export default Button;

${contents}`,
  );
};

const writeProjectRoot = async () => {
  const filepath = "package.json";
  return writeFileToPath(filepath, `{}`);
};

const createAndPopulateTmpDir = async () => {
  dir = tmp.dirSync({
    unsafeCleanup: true,
  });

  await writeSrcFile(`export default () => <div />;`);
  await writeExampleFile(`export const basic = () => <Button />`);
  await writeProjectRoot();
};

beforeEach(async () => {
  await createAndPopulateTmpDir();
});

afterEach(() => {
  if (dir != null) {
    dir.removeCallback();
  }

  if (watcher != null) {
    watcher.close();
  }
});

describe("watchComponentsFile", () => {
  it("triggers callback when examples change", async () => {
    let triggered = false;

    watcher = await watchComponentsFile(dir.name, () => {
      triggered = true;
    });

    await wait(500);
    await writeExampleFile(`export const basic = () => <div />;`);

    await wait(500);
    expect(triggered).toBe(true);

    watcher.close();
  });

  it("does trigger callback when new component found", async () => {
    let triggered = false;

    watcher = await watchComponentsFile(dir.name, () => {
      triggered = true;
    });

    await wait(500);
    await writeSrcFile(`
export default () => <div />;
export const Test = () => <div />;`);

    await wait(500);
    expect(triggered).toBe(true);

    watcher.close();
  });

  it("does trigger callback when component removed", async () => {
    let triggered = false;

    await writeSrcFile(`
export default () => <div />;
export const Test = () => <div />;`);

    watcher = await watchComponentsFile(dir.name, () => {
      triggered = true;
    });

    await wait(500);
    await writeSrcFile(`export default () => <div />;`);

    await wait(500);
    expect(triggered).toBe(true);

    watcher.close();
  });

  it("does not trigger callback when source changes", async () => {
    let triggered = false;

    watcher = await watchComponentsFile(dir.name, () => {
      triggered = true;
    });

    await wait(500);
    await writeSrcFile(`export default () => <div>changed</div>;`);

    await wait(500);
    expect(triggered).toBe(false);

    watcher.close();
  });
});
