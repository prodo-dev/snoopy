import * as path from "path";
import {generateComponentsFileContents} from "../src/generate";

const searchDir = path.resolve(__dirname, "fixtures", "example");
const brokenDir = path.resolve(__dirname, "fixtures", "broken");
const clientDir = path.resolve(__dirname, "fixtures");

describe("generateComponentsFileContents", () => {
  it("detects inside javascript", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import {Button as Component\d+} from "example\/javascript.jsx";/.test(
        contents,
      ),
    ).toBe(true);
  });
  it("detects inside typescript", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import {Button as Component\d+} from "example\/typescript\.tsx";/.test(
        contents,
      ),
    ).toBe(true);
  });
  it("detects inside index files", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import {Button as Component\d+} from "example";/.test(contents),
    ).toBe(true);
  });

  it("finds named component exports", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import {Button as Component\d+} from "example\/components\/NamedExport\.tsx";/.test(
        contents,
      ),
    ).toBe(true);
  });

  it("finds default component exports", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import Component\d+ from "example\/components\/DefaultExport\.tsx";/.test(
        contents,
      ),
    ).toBe(true);
  });

  it("finds mixed component exports", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import Component\d+, {Button as Component\d+, Button2 as Component\d+} from "example\/components\/MultipleExports\.tsx";/.test(
        contents,
      ),
    ).toBe(true);
  });

  it("ignores component files with no marked exports", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import .* from "example\/components\/Unmarked\.tsx";/.test(contents),
    ).toBe(false);
  });

  it("ignores unmarked component exports", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import {Button2 as Component\d+} from "example\/components\/Mixed\.tsx";/.test(
        contents,
      ),
    ).toBe(true);
  });

  it("finds named theme exports", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import {theme as Theme\d+} from "example\/themes\/named-export\.ts";/.test(
        contents,
      ),
    ).toBe(true);
  });

  it("finds default theme exports", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import Theme\d+ from "example\/themes\/default-export\.ts";/.test(
        contents,
      ),
    ).toBe(true);
  });

  it("finds mixed theme exports", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import Theme\d+, {theme as Theme\d+, theme2 as Theme\d+} from "example\/themes\/multiple-exports\.ts";/.test(
        contents,
      ),
    ).toBe(true);
  });

  it("ignores theme files with no marked exports", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import .* from "example\/themes\/unmarked\.ts";/.test(contents),
    ).toBe(false);
  });

  it("ignores unmarked theme exports", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import {theme2 as Theme\d+} from "example\/themes\/mixed\.ts";/.test(
        contents,
      ),
    ).toBe(true);
  });

  it("finds components and themes in the same file", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);
    expect(
      /import {Button as Component\d+, theme as Theme\d+} from "example\/mixed\.tsx";/.test(
        contents,
      ),
    ).toBe(true);
  });

  // Currently failing
  it.skip("doesn't fail on directories with broken files", async () => {
    const contents = await generateComponentsFileContents(clientDir, brokenDir);

    expect(
      /import {Button as Component\d+, theme as Theme\d+} from "good\.tsx";/.test(
        contents,
      ),
    ).toBe(true);
    expect(/import .* from "examples\/broken\.ts";/.test(contents)).toBe(false);
  });

  it("snapshot test", async () => {
    const contents = await generateComponentsFileContents(clientDir, searchDir);

    expect(contents).toMatchSnapshot();
  });
});
