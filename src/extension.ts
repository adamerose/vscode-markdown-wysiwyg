import { debuglog } from 'util';
import * as vscode from 'vscode';
import { MarkdownEditorProvider } from './markdownEditor';

export const extensionState: { document: vscode.TextDocument | undefined } = {
	document: undefined,
};

export function activate(context: vscode.ExtensionContext) {
	console.log('markdownEditor activated!');

	// Register our custom editor providers
	context.subscriptions.push(MarkdownEditorProvider.register(context));

	context.subscriptions.push(
		vscode.commands.registerCommand('markdownEditor.openCustomEditor', async (uri: vscode.Uri) => {
			handleOpenCustomEditor(uri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('markdownEditor.openDefaultEditor', async (uri: vscode.Uri) => {
			handleOpenDefaultEditor(uri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('markdownEditor.DEBUG', async (uri: vscode.Uri) => {
			console.log('DEBUG');
		})
	);
}

async function handleOpenDefaultEditor(uri: vscode.Uri) {
	console.log('handleOpenDefaultEditor', uri);

	if (extensionState?.document?.uri !== undefined) {
		vscode.commands.executeCommand('vscode.openWith', extensionState?.document?.uri, 'default');
	}
}

async function handleOpenCustomEditor(uri: vscode.Uri) {
	console.log('handleOpenCustomEditor', uri);

	if (uri === undefined) {
		if (vscode.window.activeTextEditor === undefined) {
			vscode.window.showErrorMessage('No active text editor.');
		} else if (vscode.window.activeTextEditor.document.languageId !== 'markdown') {
			vscode.window.showErrorMessage('Active editor is not markdown.');
		} else {
			uri = vscode.window.activeTextEditor.document.uri;
		}
	}

	vscode.commands.executeCommand('vscode.openWith', uri, MarkdownEditorProvider.viewType);

	// TODO - Figure out how to open custom editor in current tab instead of new tab
	// vscode.commands.executeCommand(
	// 	'workbench.action.reopenWithEditor',
	// 	uri,
	// 	MarkdownEditorProvider.viewType
	// );
}
