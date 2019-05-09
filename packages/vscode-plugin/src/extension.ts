import * as vscode from "vscode";
const fetch = require("node-fetch");

const languages = ["javascriptreact", "typescriptreact"];

export function activate(context: vscode.ExtensionContext) {
  let port = vscode.workspace.getConfiguration().get("snoopy.server.port");

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration("snoopy.server.port")) {
        port = vscode.workspace.getConfiguration().get("snoopy.server.port");
      }
    }),
  );

  vscode.window.onDidChangeActiveTextEditor(async e => {
    if (!e || !languages.includes(e.document.languageId)) {
      return;
    }

    if (!port) {
      vscode.window.showInformationMessage(
        "Please configure the Snoopy plugin.",
      );
      return;
    }

    const newFileName = e.document.fileName;
    await fetch(`http://localhost:${port}/open-file`, {
      method: "POST",
      body: newFileName,
      headers: {"Content-Type": "text/plain"},
    });
  });
}

export function deactivate() {}
