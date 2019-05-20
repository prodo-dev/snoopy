import generate from "@babel/generator";
import * as t from "@babel/types";

export const getExportNames = (node: t.ExportNamedDeclaration): string[] => {
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

export const getSourceForClassDecl = (node: t.ClassDeclaration): string =>
  generate(node).code;

export const getSourceForFunctionDecl = (node: t.FunctionDeclaration): string =>
  generate(node.body).code;

export const getSourceForVariableDecl = (
  node: t.VariableDeclaration,
): string | undefined => {
  if (node.declarations.length === 1) {
    const decl = node.declarations[0];
    if (decl.init) {
      if (t.isArrowFunctionExpression(decl.init)) {
        return getSourceForArrowFunction(decl.init);
      }
    }
  }

  return undefined;
};

export const getSourceForNamedExport = (
  node: t.ExportNamedDeclaration,
): string | undefined => {
  if (t.isVariableDeclaration(node.declaration)) {
    return getSourceForVariableDecl(node.declaration);
  }

  if (t.isClassDeclaration(node.declaration)) {
    return getSourceForClassDecl(node.declaration);
  }

  if (t.isFunctionDeclaration(node.declaration)) {
    return getSourceForFunctionDecl(node.declaration);
  }

  return undefined;
};

export const getSourceForDefaultExport = (
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
