import {transform} from "@babel/core";
import {parse} from "@babel/parser";
import pluginSyntaxJsx from "@babel/plugin-syntax-jsx";
import pluginSyntaxTypescript from "@babel/plugin-syntax-typescript";
import pluginTransformReactJsx from "@babel/plugin-transform-react-jsx";
import traverse, {Visitor} from "@babel/traverse";
import * as t from "@babel/types";
import {File, FileError, FileExport} from "./types";

interface VisitorState {
  filepath: string;
  fileExports: FileExport[];
  errors: FileError[];
  componentNames: string[];
}

interface VisitorOptions {
  invalidProdoTagError: string;
}

type ExportVisitor = Visitor<VisitorState>;

const checkComment = (regex: RegExp, comments: readonly t.Comment[]): boolean =>
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
        const exportNames = getExportNames(path.node);
        state.fileExports.push(
          ...exportNames.map(name => {
            const fileExport: FileExport = {
              isDefaultExport: false,
              name,
            };

            return fileExport;
          }),
        );
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

const isReactElement = (target: t.Node) => {
  if (t.isCallExpression(target)) {
    const callee = target.callee;
    if (t.isMemberExpression(callee)) {
      const object: t.Expression = callee.object;
      const property: any = callee.property;
      return (
        t.isIdentifier(object) &&
        object.name === "React" &&
        property.name === "createElement"
      );
    }
  }
  return false;
};

const returnsReactElement = (target: t.Node): boolean => {
  if (isReactElement(target)) {
    return true;
  } else if (t.isBlockStatement(target)) {
    const lastStatement = target.body[target.body.length - 1];
    if (t.isReturnStatement(lastStatement) && lastStatement.argument) {
      return isReactElement(lastStatement.argument);
    }
  }
  return false;
};

const addIfReactElement = (
  target: t.Node,
  state: VisitorState,
  exportNames?: string[],
) => {
  if (returnsReactElement(target)) {
    if (exportNames) {
      state.fileExports.push(
        ...exportNames.map(name => {
          const fileExport: FileExport = {
            isDefaultExport: false,
            name,
          };

          return fileExport;
        }),
      );
      state.componentNames = state.componentNames.concat(exportNames);
    } else {
      state.fileExports.push({isDefaultExport: true});
    }
  }
};

const declaresReactElement = (node: t.VariableDeclaration) => {
  const declarator: t.VariableDeclarator = node.declarations[0];
  const name: string = t.isIdentifier(declarator.id) ? declarator.id.name : "";
  const target: t.Expression | null = declarator.init;
  const elem = t.isArrowFunctionExpression(target) ? target.body : target;
  return name && target && elem && returnsReactElement(elem);
};

const akExportVisitor = (): ExportVisitor => ({
  enter(path, state) {
    if (t.isExportNamedDeclaration(path.node)) {
      const exportNames = getExportNames(path.node);
      const declaration = path.node.declaration;
      if (
        t.isVariableDeclaration(declaration) &&
        declaresReactElement(declaration)
      ) {
        state.fileExports.push(
          ...exportNames.map(name => {
            const fileExport: FileExport = {
              isDefaultExport: false,
              name,
            };
            return fileExport;
          }),
        );
      }
    } else if (t.isExportDefaultDeclaration(path.node)) {
      const declaration = path.node.declaration;
      if (t.isIdentifier(declaration)) {
        if (state.componentNames.indexOf(declaration.name) >= 0) {
          state.fileExports.push({
            isDefaultExport: true,
          });
        }
      } else {
        const target = t.isArrowFunctionExpression(declaration)
          ? declaration.body
          : declaration;
        addIfReactElement(target, state);
      }
    } else if (t.isVariableDeclaration(path.node)) {
      if (declaresReactElement(path.node)) {
        const declarator: t.VariableDeclarator = path.node.declarations[0];
        const name: string = t.isIdentifier(declarator.id)
          ? declarator.id.name
          : "";
        state.componentNames.push(name);
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

export const autodetectFileExports = (
  visitor: ExportVisitor,
  code: string,
  filepath: string,
): File | null => {
  let ast: t.File;
  const state: VisitorState = {
    filepath,
    fileExports: [],
    errors: [],
    componentNames: [],
  };

  try {
    // TODO: tranform vs parse vs traverse?
    const result = transform(code, {
      sourceType: "module",
      plugins: [
        pluginSyntaxJsx,
        pluginTransformReactJsx,
        [pluginSyntaxTypescript, {isTSX: true}],
      ],
    });

    ast = parse(result!.code || "", {
      sourceType: "module",
      plugins: ["jsx", "typescript", "exportDefaultFrom", "classProperties"],
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
    componentNames: [],
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

export const findComponentExports = (code: string, filepath: string) => {
  const emptyResult = {
    filepath,
    fileExports: [],
    errors: [],
  };
  const detectedExports =
    autodetectFileExports(akExportVisitor(), code, filepath) || emptyResult;
  const manualExports =
    findFileExports(componentVisitor, code, filepath) || emptyResult;

  return {
    filepath,
    fileExports: detectedExports.fileExports.concat(manualExports.fileExports),
    errors: detectedExports.errors.concat(manualExports.errors),
  };
};

export const findThemeExports = (code: string, filepath: string) =>
  findFileExports(themeVisitor, code, filepath);
