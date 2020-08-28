// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-gisdk" is now active!');

	// Get the path of all compiler installed in system.
	const utils = require('./utils.js');
	const compilers: string[] = await utils.getCompilersPath();

	// Create a select bar to select which rscc compiler will be used.
	let rsccSelectBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 11);
	rsccSelectBar.command = "vscode-gisdk.selectCompiler";
	rsccSelectBar.tooltip = "Select which compiler you want to use.";

	let compilerState = context.globalState.get<string>('compilerPath');
	if (compilerState) {
		rsccSelectBar.text = '$(codicon-settings)' + 'GISDK' + '(' + path.dirname(compilerState) + '\\' + path.basename(compilerState) + ')';
	} else if (compilers) {
		context.globalState.update('compilerPath', compilers[0]);
		rsccSelectBar.text = '$(codicon-settings)' + 'GISDK' + '(' + path.dirname(compilers[0]) + '\\' + path.basename(compilers[0]) + ')';
	} else {
		rsccSelectBar.text = '$(codicon-settings)' + 'There\'s no rscc installed.';
	}

	vscode.window.activeTextEditor?.document.languageId !== 'gisdk' || rsccSelectBar.show();
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((e) => {
		if (e?.document.languageId === 'gisdk') {
			rsccSelectBar.show();
		} else {
			rsccSelectBar.hide();
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand("vscode-gisdk.selectCompiler", () => {
		vscode.window.showQuickPick(compilers, { canPickMany: false }).then((picked) => {
			if (picked) {
				context.globalState.update('compilerPath', picked);
				rsccSelectBar.text = '$(codicon-settings)' + 'GISDK' + '(' + path.dirname(picked) + '\\' + path.basename(picked) + ')';
			}
		});
	}));


	context.subscriptions.push(vscode.tasks.registerTaskProvider("rscc", {
		async provideTasks() {
			// Check if has any avaliable compiler.
			let compilerPath = context.globalState.get<string>('compilerPath');
			if (!compilerPath) {
				return undefined;
			}

			// check if there is any file opend
			let file = vscode.window.activeTextEditor?.document.uri.fsPath;
			if (!file) {
				return undefined;
			}

			// check if this file is supported.
			let extName = path.extname(file);
			if (extName.match(/\.rsc|\.gisdk|\.model|\.scenarios/g)?.length === 0) {
				return undefined;
			}

			// compile the current opend file by setting difinition
			let definition: vscode.TaskDefinition = { type: 'rscc' };
			let fileDirName = path.dirname(file);
			let fileName = path.basename(file, extName);
			definition.args = [
				"-c",
				"-u",
				"'" + fileDirName + '\\' + fileName + '.dbd' + "'",
				"'" + (extName === ".lst" ? '@' + file : file) + "'"
			];

			let defaultShell = vscode.workspace.getConfiguration('terminal').get<string>('integrated.shell.windows');
			let len = defaultShell?.match(/powershell\.exe/)?.length;
			if (len === undefined || len > 0) {
				return [new vscode.Task(definition, "compile this file", "rscc", new vscode.ShellExecution("& '" + compilerPath + "' " + definition['args'].toString().replace(/,/g, ' ')), "$rscc")];
			} else {
				return [new vscode.Task(definition, "compile this file", "rscc", new vscode.ShellExecution('"' + compilerPath + '" ' + definition['args'].toString().replace(/,/g, ' ')), "$rscc")];
			}
		},
		async resolveTask(_task: vscode.Task) {
			let compilerPath = _task.definition.compilerPath ? _task.definition.compilerPath : context.globalState.get<string>('compilerPath');

			let defaultShell = vscode.workspace.getConfiguration('terminal').get<string>('integrated.shell.windows');
			let len = defaultShell?.match(/powershell\.exe/)?.length;
			if (len === undefined || len > 0) {
				return new vscode.Task(_task.definition, _task.name, _task.source, new vscode.ShellExecution("& '" + compilerPath + "' " + _task.definition['args'].toString().replace(/,/g, ' ')), "$rscc");
			} else {
				return new vscode.Task(_task.definition, _task.name, _task.source, new vscode.ShellExecution('"' + compilerPath + '" ' + _task.definition['args'].toString().replace(/,/g, ' ')), "$rscc");
			}
		}
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('......');
}
