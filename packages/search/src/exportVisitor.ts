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
    (t.isVariableDeclaration(declaration) ||
      t.isClassDeclaration(declaration) ||
      t.isFunctionDeclaration(declaration))
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

const getSourceForArrowFunction = (node: t.ArrowFunctionExpression): string =>
  generate(node.body).code;

const getSourceForClassDecl = (node: t.ClassDeclaration): string =>
  generate(node).code;

const getSourceForFunctionDecl = (node: t.FunctionDeclaration): string =>
  generate(node.body).code;

const getSourceForNamedExport = (
  node: t.ExportNamedDeclaration,
): string | undefined => {
  if (
    t.isVariableDeclaration(node.declaration) &&
    node.declaration.declarations.length === 1
  ) {
    const decl = node.declaration.declarations[0];
    if (decl.init) {
      if (t.isArrowFunctionExpression(decl.init)) {
        return getSourceForArrowFunction(decl.init);
      }
    }
  }

  if (t.isClassDeclaration(node.declaration)) {
    return getSourceForClassDecl(node.declaration);
  }

  if (t.isFunctionDeclaration(node.declaration)) {
    return getSourceForFunctionDecl(node.declaration);
  }

  return undefined;
};

const getSourceForDefaultExport = (
  node: t.ExportDefaultDeclaration,
): string | undefined => {
  if (t.isArrowFunctionExpression(node.declaration)) {
    return getSourceForArrowFunction(node.declaration);
  }

  if (t.isClassDeclaration(node.declaration)) {
    return getSourceForClassDecl(node.declaration);
  }

  if (t.isFunctionDeclaration(node.declaration)) {
    return getSourceForFunctionDecl(node.declaration);
  }

  return undefined;
};

const getSourceForExport = (
  node: t.ExportNamedDeclaration | t.ExportDefaultDeclaration,
): string | undefined =>
  t.isExportNamedDeclaration(node)
    ? getSourceForNamedExport(node)
    : getSourceForDefaultExport(node);

export const mkExportVisitor = (opts: VisitorOptions): ExportVisitor => ({
  enter(path, state) {
    const visitExport =
      opts.lineRegex != null
        ? checkComment(opts.lineRegex, path.node.leadingComments)
        : true;

    if (visitExport) {
      if (t.isExportNamedDeclaration(path.node)) {
        const source = getSourceForExport(path.node);
        const exportNames = getExportNames(path.node);
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
        const source = getSourceForExport(path.node);
        state.fileExports.push({isDefaultExport: true, source});
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
