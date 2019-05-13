import * as path from "path";
import {findProjectRoot, findExampleFiles} from "../src/pkg";

const exampleDir = path.resolve(__dirname, "fixtures", "example");
const noExamplesDir = path.resolve(__dirname, "fixures", "no-examples");

describe("findProjectRoot", () => {
  it("can find the project root when cwd is the root", async () => {
    const root = await findProjectRoot(exampleDir);
    expect(root).toBe(exampleDir);
  });

  it("can find the project root when cwd is not the root", async () => {
    const root = await findProjectRoot(path.resolve(exampleDir, "src"));
    expect(root).toBe(exampleDir);
  });
});

describe("findExampleFiles", () => {
  it("finds example files", async () => {
    const files = await findExampleFiles(exampleDir);
    expect(files).toEqual([
      path.resolve(exampleDir, ".prodo/Button.example.tsx"),
    ]);
  });

  it("finds no files when .prodo directory does not exist", async () => {
    const files = await findExampleFiles(noExamplesDir);
    expect(files).toEqual([]);
  });
});
