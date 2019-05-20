import {parse} from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import {format} from "./format";
import {
  ExportVisitor,
  File,
  FileError,
  FileExport,
  VisitorOptions,
  VisitorState,
} from "./types";
import {
  getExportNames,
  getSourceForDefaultExport,
  getSourceForNamedExport,
} from "./utils/visitor";

const getSourceForExport = (
  node: t.ExportNamedDeclaration | t.ExportDefaultDeclaration,
): string | undefined => {
  const source = t.isExportNamedDeclaration(node)
    ? getSourceForNamedExport(node)
    : getSourceForDefaultExport(node);

  if (source == null) {
    return undefined;
  }

  try {
    return format(source);
  } catch (e) {
    return source;
  }
};

const checkComment = (
  regex: RegExp,
  comments: readonly t.Comment[] | null,
): boolean =>
  comments != null &&
  comments.reduce((acc: boolean, c) => acc || regex.test(c.value), false);

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
