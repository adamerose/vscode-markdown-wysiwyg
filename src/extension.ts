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
		// Sanity check. These cases shouldn't happen
		if (vscode.window.activeTextEditor === undefined) {
			vscode.window.showErrorMessage('No active text editor.');
			return;
		}
		if (vscode.window.activeTextEditor?.document.languageId !== 'markdown') {
			vscode.window.showErrorMessage('Active editor is not markdown.');
			return;
		}

		// Set URI to active editor if not provided
		uri = uri ?? vscode.window.activeTextEditor?.document.uri;

		// Save current document first so user isn't prompted to save when closing the editor
		// TODO - Figure out how to reopen custom editor in current tab so we can switch editors without saving
		await vscode.window.activeTextEditor?.document.save();

		// Get current tab and store it in temp then close it after opening new custom editor
		const temp = vscode.window.activeTextEditor;
		vscode.commands.executeCommand('vscode.openWith', uri, MarkdownEditorProvider.viewType);
		temp.hide();

		// We can remove deprecated hide usage after this is resolved: https://github.com/microsoft/vscode/issues/169921
		// We did it this way to avoid the flickering problem described in the issue
	});

	registerCommand('markdownEditor.openDefaultEditor', async (uri: vscode.Uri) => {
		// Sanity check. These cases shouldn't happen
		if (extensionState?.activeDocument?.uri === undefined) {
			vscode.window.showErrorMessage('extensionState?.activeDocument?.uri is undefined.');
			return;
		}

		// Save current document first so user isn't prompted to save when closing the editor
		// TODO - Figure out how to reopen custom editor in current tab so we can switch editors without saving
		await extensionState?.activeDocument?.save();

		// Get URI of current markdown file which we keep track of in this extension as global state
		vscode.commands.executeCommand(
			'workbench.action.reopenTextEditor',
			extensionState?.activeDocument?.uri
		);
	});
}
