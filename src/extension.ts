import * as vscode from 'vscode';
import { MarkdownEditorProvider } from './markdownEditor';

export function activate(context: vscode.ExtensionContext) {
	// Register our custom editor providers
	context.subscriptions.push(MarkdownEditorProvider.register(context));
}
