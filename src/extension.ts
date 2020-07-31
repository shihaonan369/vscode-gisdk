// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-gisdk" is now active!');

	context.subscriptions.push(vscode.tasks.registerTaskProvider("rscc", {
		async provideTasks() {
			// check if there is any file opend
			let file = vscode.window.activeTextEditor?.document.uri.fsPath;
			if (!file) {
				return undefined;
			}

			// get path of compiler from registry
			const utils = require('./utils.js');
			let compilerPath = await utils.getCompilerPath();

			// compile the current opend file by setting difinition
			let definition : vscode.TaskDefinition = {type: 'rscc'};
			let fileDirName = path.dirname(file);
			let extName = path.extname(file);
			let fileName = path.basename(file, extName);
			definition.args = [
				"-c",
				"-u",
				"'" + fileDirName + '\\' + fileName + '.dbd' + "'",
				"'" + (extName === ".lst" ? '@' + file : file) + "'"
			];

			let defaultShell = vscode.workspace.getConfiguration('terminal').get<string>('integrated.shell.windows');
			let len = defaultShell?.match(/powershell\.exe/)?.length;
			if (len && len > 0) {
				return [new vscode.Task(definition, "compile this file", "rscc", new vscode.ShellExecution("& '" + compilerPath + "' " + definition['args'].toString().replace(/,/g, ' ')), "$rscc")];
			} else {
				return [new vscode.Task(definition, "compile this file", "rscc", new vscode.ShellExecution('"' + compilerPath + '" ' + definition['args'].toString().replace(/,/g, ' ')), "$rscc")];
			}
		},
		async resolveTask(_task: vscode.Task) {
			// get path of compiler from registry
			const utils = require('./utils.js');
			let compilerPath = await utils.getCompilerPath();

			let defaultShell = vscode.workspace.getConfiguration('terminal').get<string>('integrated.shell.windows');
			let len = defaultShell?.match(/powershell\.exe/)?.length;
			if (len && len > 0) {
				return new vscode.Task(_task.definition, _task.name, _task.source,  new vscode.ShellExecution("& '" + compilerPath + "' " + _task.definition['args'].toString().replace(/,/g, ' ')), "$rscc");
			} else {
				return new vscode.Task(_task.definition, _task.name, _task.source, new vscode.ShellExecution('"' + compilerPath + '" ' + _task.definition['args'].toString().replace(/,/g, ' ')), "$rscc");
			}
		}
	}));
	context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('gisdk', {
		provideDebugConfigurations(folder: vscode.WorkspaceFolder | undefined) : vscode.ProviderResult<vscode.DebugConfiguration[]> {
			return [
				{
					type: 'gisdk',
					name: 'Launch',
					request: 'launch'
				}
			];
		}
	}, vscode.DebugConfigurationProviderTriggerKind.Dynamic));
}

// this method is called when your extension is deactivated
export function deactivate() {}
