import {findFileExports, mkExportVisitor} from "../src/exportVisitor";

const sourceVisitor = mkExportVisitor({});

const getSource = (code: string): string | undefined => {
  const file = findFileExports(sourceVisitor, code.trim(), "");

  if (file == null) {
    throw new Error("file should not be null.");
  }

  if (file.fileExports.length !== 1) {
    throw new Error("fileExports should have length 1.");
  }

  return file.fileExports[0].source;
};

let body = `{
  return <div onClick={() => alert("test")} />;
}`;

describe("get source from exports", () => {
  it("should get source from named arrow function", () => {
    const source = getSource(`export const Foo = () => ${body}`);
    expect(source).toBe(body);
  });

  it("should get source from named function", () => {
    const source = getSource(`export function foo() ${body}`);
    expect(source).toBe(body);
  });

  it("should get source from named class", () => {
    body = `class Button extends React.Component {
  render() {
    return <div onClick={() => alert("test")} />;
  }
}`;
    const source = getSource(`
    export ${body}`);
    expect(source).toBe(body);
  });

  it("should get source from default arrow", () => {
    body = `{
  return <div onClick={() => alert("test")} />;
}`;
    const source = getSource(`export default () => ${body}`);
    expect(source).toBe(body);
  });

  it("should get source from default function with name", () => {
    const source = getSource(`export default function foo() ${body}`);
    expect(source).toBe(body);
  });

  it("should get source from default function without name", () => {
    const source = getSource(`export default function() ${body}`);
    expect(source).toBe(body);
  });

  it("should get source from default class", () => {
    body = `class extends React.Component {
  render() {
    return <div onClick={() => alert("test")} />;
  }

}`;
    const source = getSource(`
    export default ${body}`);
    expect(source).toBe(body);
  });
});
