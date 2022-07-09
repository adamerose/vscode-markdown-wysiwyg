import { debuglog } from 'util';
import * as vscode from 'vscode';
import { MarkdownEditorProvider } from './markdownEditor';

export const extensionState: {
	activeDocument: vscode.TextDocument | undefined;
	activeWebviewPanel: vscode.WebviewPanel | undefined;
} = {
	// Need to manually track the current webview & document, since with a
	// CustomTextEditor, vscode.window.activeTextEditor is always undefined
	// https://github.com/microsoft/vscode/issues/102110#issuecomment-656868579
	activeDocument: undefined,
	activeWebviewPanel: undefined,
};

export function activate(context: vscode.ExtensionContext) {
	console.log('markdownEditor activated!');

	// Register our custom editor providers
	context.subscriptions.push(MarkdownEditorProvider.register(context));

	// Helper method to register commands and push subscription
	function registerCommand(command: string, callback: (...args: any[]) => any) {
		context.subscriptions.push(vscode.commands.registerCommand(command, callback));
	}

	registerCommand('markdownEditor.openCustomEditor', async (uri: vscode.Uri) => {
		if (uri !== undefined && uri.path != vscode.window.activeTextEditor?.document.uri.path) {
			// This case should happen only when the user right clicks a file in the explorer and
			// clicks the "Open WYSIWYG Editor" option, and the file isn't already shown in an active editor
			vscode.commands.executeCommand('vscode.openWith', uri, MarkdownEditorProvider.viewType);
		} else if (vscode.window.activeTextEditor === undefined) {
			// This case shouldn't happen
			vscode.window.showErrorMessage('No active text editor.');
		} else {
			// Check if document is markdown
			if (vscode.window.activeTextEditor.document.languageId !== 'markdown') {
				vscode.window.showErrorMessage('Active editor is not markdown.');
			}

			// Close and reopen the document with our custom editor
			vscode.commands.executeCommand('workbench.action.closeActiveEditor').then(() => {
				vscode.commands.executeCommand('vscode.openWith', uri, MarkdownEditorProvider.viewType);
			});

			// TODO - Figure out how to open custom editor in current tab instead closing and reopening (causes minor flicker)
			// Maybe look at multiCommand.openFileInActiveEditor https://stackoverflow.com/a/60218926/3620725
			// The code below doesn't seem to work because it just prompts the user to pick an editor type, not sure if I can specify it. reopenWithEditor is not documented...
			// vscode.commands.executeCommand(
			// 	'workbench.action.reopenWithEditor',
			// 	uri,
			// 	MarkdownEditorProvider.viewType
			// );
			//
		}
	});

	registerCommand('markdownEditor.openDefaultEditor', async (uri: vscode.Uri) => {
		// Get URI of current markdown file which we keep track of in this extension as global state
		if (extensionState?.activeDocument?.uri === undefined) {
			vscode.window.showErrorMessage('extensionState?.activeDocument?.uri is undefined.');
		} else {
			vscode.window.showInformationMessage('openDefaultEditor');

			vscode.commands.executeCommand(
				'workbench.action.reopenTextEditor',
				extensionState?.activeDocument?.uri
			);
		}
	});

	registerCommand('markdownEditor.DEBUG', async (uri: vscode.Uri) => {
		vscode.commands
			.executeCommand('workbench.action.reopenEditorWith', extensionState?.activeDocument?.uri)
			.then((onfulfilled) => {
				console.log(onfulfilled);
			});
	});
}
