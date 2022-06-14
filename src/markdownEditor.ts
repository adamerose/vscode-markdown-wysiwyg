import { time } from 'console';
import * as vscode from 'vscode';
import { extensionState } from './extension';

const prettier = require('prettier');

export class MarkdownEditorProvider implements vscode.CustomTextEditorProvider {
	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new MarkdownEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(
			MarkdownEditorProvider.viewType,
			provider,
			{
				webviewOptions: { retainContextWhenHidden: true },
			}
		);
		return providerRegistration;
	}

	static readonly viewType = 'markdownEditor.customEditor';

	constructor(private readonly context: vscode.ExtensionContext) {}

	private editQueue: Array<vscode.WorkspaceEdit> = [];
	private editQueueRunning = false;

	// Called when our custom editor is opened.
	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {
		// Setup initial webview HTML and settings
		webviewPanel.webview.options = { enableScripts: true };
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

		// Update global state when a webview is focused.
		function handleFocusChange(panel: vscode.WebviewPanel, initialLoadFlag = false) {
			console.log('handleFocusChange', panel.active);
			if (panel.active) {
				extensionState.activeDocument = document;
				extensionState.activeWebviewPanel = panel;
				// This is used in the contibution point "when" clauses indicating which icons and hotkeys to activate
				vscode.commands
					.executeCommand('setContext', 'markdownEditor.editorIsActive', true)
					.then(() => {
						console.log('markdownEditor.editorIsActive', true);
					});
			} else if (!panel.active && panel === extensionState.activeWebviewPanel) {
				vscode.commands
					.executeCommand('setContext', 'markdownEditor.editorIsActive', false)
					.then(() => {
						console.log('markdownEditor.editorIsActive', false);
					});
			}

			console.log(
				`${initialLoadFlag ? '(Initial Load)' : '(onDidChangeViewState)'} Active: ${
					panel.active
				} - ${document?.uri.toString()}`
			);
		}

		// We need to manually trigger this once inside of resolveCustomTextEditor since onDidChangeViewState does not run on initial load.
		handleFocusChange(webviewPanel, true);

		webviewPanel.onDidChangeViewState((e) => {
			handleFocusChange(e.webviewPanel);
		});

		////////////////////////////////////////////////////////////////////////////////////////
		// Hook up event handlers so that we can synchronize the webview with the text document.
		//
		// The text document acts as our model, so we have to sync changes in the document to our
		// editor and sync changes in the editor back to the document.
		//
		// Remember that a single text document can also be shared between multiple custom
		// editors (this happens for example when you split a custom editor)

		function updateWebview() {
			let text = document.getText();

			// Change EOL to \n because that's what CKEditor5 uses internally
			text = text.replace(/(?:\r\n|\r|\n)/g, '\n');

			console.log('updateWebview', [JSON.stringify(text)]);
			webviewPanel.webview.postMessage({ type: 'documentChanged', text: text });
		}

		const saveDocumentSubscription = vscode.workspace.onDidSaveTextDocument((e) => {
			console.log('Saved Document');
			updateWebview();
		});

		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
			console.log('Changed Document: ', [JSON.stringify(e.document.getText())]);
		});

		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			console.log('Disposed1');
			if (extensionState.activeWebviewPanel === webviewPanel) {
				vscode.commands
					.executeCommand('setContext', 'markdownEditor.editorIsActive', false)
					.then(() => {
						console.log('markdownEditor.editorIsActive', false);
					});
			}
			console.log('Disposed2');
			changeDocumentSubscription.dispose();
			saveDocumentSubscription.dispose();
		});

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage((e) => {
			switch (e.type) {
				case 'webviewChanged':
					this.updateTextDocument(document, e.text);
					return;
				case 'initialized':
					updateWebview();
					return;
			}
		});
	}

	// Get the static html used for the editor webviews.
	private getHtmlForWebview(webview: vscode.Webview): string {
		// Local path to script and css for the webview
		const initScriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this.context.extensionUri, 'src', 'markdownEditorInitScript.js')
		);
		const ckeditorUri = webview.asWebviewUri(
			vscode.Uri.joinPath(
				this.context.extensionUri,
				...'ckeditor5-build-markdown/build/ckeditor.js'.split('/')
			)
		);

		return /* html */ `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Markdown WYSIWYG Editor</title>
			</head>
			<body>
				<div id="editor">
					
				</div>
				
				<script src="${ckeditorUri}"></script>
				<script>
					MarkdownEditor
					.create( document.querySelector( '#editor' ) )
					.then( editor => {
						window.editor = editor;
						editor.timeLastModified = new Date();
						console.log( "CKEditor instance:", editor);
					} )
					.catch( error => {
						console.error("CKEditor Initialization Error:",  error );
					} );
				</script>
				<script src="${initScriptUri}"></script>
			</body>
			</html>`;
	}

	// Save new content to the text document. Adds all new edits to a queue then calls them in order using .then
	private updateTextDocument(document: vscode.TextDocument, text: any) {
		console.log('VS Code started updateTextDocument', [JSON.stringify(text)]);

		let rawText = text;

		// Autoformat the markdown text using Prettier
		text = prettier.format(text, {
			parser: 'markdown',
		});

		let prettierText = text;

		// Standardize text EOL character to match document
		// https://code.visualstudio.com/api/references/vscode-api#EndOfLine
		const eol_chars = document?.eol == 2 ? '\r\n' : '\n';
		text = text.replace(/(?:\r\n|\r|\n)/g, eol_chars);

		let finalText = text;
		let fileText = document?.getText();

		if (text != fileText) {
			// Just replace the entire document every time for this example extension.
			// A more complete extension should compute minimal edits instead.
			const newEdit = new vscode.WorkspaceEdit();
			newEdit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), text);
			this.editQueue.push(newEdit);
			if (this.editQueueRunning == false) {
				this.editQueueRunning = true;
				this.processEditQueue(this.editQueue);
			}

			// console.debug('Updating Document because content changed');
			// console.debug('rawText', JSON.stringify(rawText));
			// console.debug('prettierText', JSON.stringify(prettierText));
			// console.debug('finalText', JSON.stringify(finalText));
			// console.debug('fileText', JSON.stringify(fileText));
		}
	}

	private processEditQueue(queue: Array<vscode.WorkspaceEdit>) {
		console.log('VS Code started processEditQueue');
		const edit = queue.shift();
		if (edit != undefined) {
			const text = (edit as any)._edits[0].edit._newText;
			console.log('VS Code started applyEdit', [JSON.stringify(text)]);
			vscode.workspace.applyEdit(edit).then(
				() => {
					console.log('VS Code finished applyEdit', [JSON.stringify(text)]);

					this.processEditQueue(queue);
				},
				() => {
					console.log('VS Code failed applyEdit', [JSON.stringify(text)]);
				}
			);
		} else {
			console.log('VS Code finished processEditQueue');
			this.editQueueRunning = false;
		}
	}
}
