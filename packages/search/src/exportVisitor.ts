import {parse} from "@babel/parser";
import traverse, {Visitor} from "@babel/traverse";
import * as t from "@babel/types";
import {File, FileError, FileExport} from "./types";
import generate from "@babel/generator";

interface VisitorState {
  filepath: string;
  fileExports: FileExport[];
  errors: FileError[];
}

interface VisitorOptions {
  lineRegex?: RegExp;
  invalidProdoTagError?: string;
  ignoreDefaultExport?: boolean;
}

type ExportVisitor = Visitor<VisitorState>;

const checkComment = (
  regex: RegExp,
  comments: readonly t.Comment[] | null,
): boolean =>
  comments != null &&
  comments.reduce((acc: boolean, c) => acc || regex.test(c.value), false);

const getExportNames = (node: t.ExportNamedDeclaration): string[] => {
  const declaration = node.declaration;
  const specifiers = node.specifiers;

  if (
    declaration != null &&
    (t.isVariableDeclaration(declaration) || t.isClassDeclaration(declaration))
  ) {
    const id = t.isVariableDeclaration(declaration)
      ? declaration.declarations[0].id
      : declaration.id;
    if (t.isIdentifier(id)) {
      return [id.name];
    }
  }

  if (specifiers) {
    return specifiers.reduce((names: string[], s) => {
      if (t.isExportSpecifier(s)) {
        return [...names, s.exported.name];
      }

      return names;
    }, []);
  }

  return [];
};

const getSourceForExport = (
  node: t.ExportNamedDeclaration,
): string | undefined => {
  if (
    t.isVariableDeclaration(node.declaration) &&
    node.declaration.declarations.length === 1
  ) {
    const decl = node.declaration.declarations[0];
    if (decl.init) {
      if (t.isArrowFunctionExpression(decl.init)) {
        return generate(decl.init.body).code;
      }
    }
  }

  return undefined;
};

export const mkExportVisitor = (opts: VisitorOptions): ExportVisitor => ({
  enter(path, state) {
    const visitExport =
      opts.lineRegex != null
        ? checkComment(opts.lineRegex, path.node.leadingComments)
        : true;

    if (visitExport) {
      if (t.isExportNamedDeclaration(path.node)) {
        const exportNames = getExportNames(path.node);
        const source = getSourceForExport(path.node);
        state.fileExports.push(
          ...exportNames.map(name => {
            const fileExport: FileExport = {
              isDefaultExport: false,
              name,
              source,
            };

            return fileExport;
          }),
        );
      } else if (
        !opts.ignoreDefaultExport &&
        t.isExportDefaultDeclaration(path.node)
      ) {
        state.fileExports.push({isDefaultExport: true});
      } else {
        if (opts.invalidProdoTagError != null) {
          state.errors.push(
            new FileError(state.filepath, opts.invalidProdoTagError),
          );
        }
      }
    }
  },
});

export const findFileExports = (
  visitor: ExportVisitor,
  code: string,
  filepath: string,
): File | null => {
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
