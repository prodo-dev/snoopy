import {parse} from "@babel/parser";
import traverse, {Visitor} from "@babel/traverse";
import * as t from "@babel/types";
import {File, FileError, FileExport} from "./types";

interface VisitorState {
  filepath: string;
  fileExports: FileExport[];
  errors: FileError[];
}

interface VisitorOptions {
  invalidProdoTagError: string;
}

type ExportVisitor = Visitor<VisitorState>;

const checkComment = (regex: RegExp, comments: readonly t.Comment[]): boolean =>
  comments.reduce((acc: boolean, c) => acc || regex.test(c.value), false);

const getExportName = (node: t.ExportNamedDeclaration): string | null => {
  const declaration = node.declaration;
  if (
    declaration != null &&
    (t.isVariableDeclaration(declaration) || t.isClassDeclaration(declaration))
  ) {
    const id = t.isVariableDeclaration(declaration)
      ? declaration.declarations[0].id
      : declaration.id;
    if (t.isIdentifier(id)) {
      return id.name;
    }
  }

  return null;
};

const mkExportVisitor = (
  lineRegex: RegExp,
  visitorOptions: VisitorOptions,
): ExportVisitor => ({
  enter(path, state) {
    if (
      path.node.leadingComments != null &&
      checkComment(lineRegex, path.node.leadingComments)
    ) {
      if (t.isExportNamedDeclaration(path.node)) {
        const exportName = getExportName(path.node);
        if (exportName) {
          state.fileExports.push({isDefaultExport: false, name: exportName});
        }
      } else if (t.isExportDefaultDeclaration(path.node)) {
        state.fileExports.push({isDefaultExport: true});
      } else {
        state.errors.push(
          new FileError(state.filepath, visitorOptions.invalidProdoTagError),
        );
      }
    }
  },
});

const prodoComponentRegex = /^\s*@prodo(\s|$)/;
const componentVisitor = mkExportVisitor(prodoComponentRegex, {
  invalidProdoTagError:
    "The `@prodo` tag must be directly above an exported React component.",
});

const prodoThemeRegex = /^\s*@prodo:theme\b/;
const themeVisitor = mkExportVisitor(prodoThemeRegex, {
  invalidProdoTagError:
    "The `@prodo:theme` tag must be directly above an exported theme.",
});

const prodoFileRegex = /\/\/\s*@prodo/;
const isPossibleProdoFile = (code: string): boolean =>
  prodoFileRegex.test(code);

export const findFileExports = (
  visitor: ExportVisitor,
  code: string,
  filepath: string,
): File | null => {
  if (!isPossibleProdoFile(code)) {
    return null;
  }

  let ast: t.File;
  const state: VisitorState = {
    filepath,
    fileExports: [],
    errors: [],
  };

  try {
    ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
  } catch (e) {
    return {
      filepath,
      fileExports: [],
      errors: [new FileError(filepath, `Error parsing file: ${e.message}`)],
    };
  }

  try {
    // babel types are broken and does not allow state to be anything
    // but an ast node.
    traverse(ast, visitor as any, undefined, state);
  } catch (e) {
    return {
      filepath,
      fileExports: [],
      errors: [new FileError(filepath, `Error traversing file: ${e.message}`)],
    };
  }

  if (state.fileExports.length === 0 && state.errors.length === 0) {
    return null;
  }

  return {
    filepath,
    fileExports: state.fileExports,
    errors: state.errors,
  };
};

export const findComponentExports = (code: string, filepath: string) =>
  findFileExports(componentVisitor, code, filepath);

export const findThemeExports = (code: string, filepath: string) =>
  findFileExports(themeVisitor, code, filepath);
