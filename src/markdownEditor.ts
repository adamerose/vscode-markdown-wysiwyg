import * as vscode from 'vscode';

export class MarkdownEditorProvider implements vscode.CustomTextEditorProvider {
	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new MarkdownEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(
			MarkdownEditorProvider.viewType,
			provider
		);
		return providerRegistration;
	}

	private static readonly viewType = 'markdownEditorExtension.markdown';

	constructor(private readonly context: vscode.ExtensionContext) {}

	private editQueue: Array<vscode.WorkspaceEdit> = [];
	private editQueueRunning = false;
	private document: vscode.TextDocument | undefined;

	// Called when our custom editor is opened.
	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {
		this.document = document;
		// Setup initial content for the webview
		webviewPanel.webview.options = {
			enableScripts: true,
		};
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

		function updateWebview() {
			let text = document.getText();

			// Change EOL to \n because that's what CKEditor5 uses internally
			text = text.replace(/(?:\r\n|\r|\n)/g, '\n');

			console.log('VS Code sent message: documentChanged', JSON.stringify(text));
			webviewPanel.webview.postMessage({
				type: 'documentChanged',
				text: text,
			});
		}

		// Hook up event handlers so that we can synchronize the webview with the text document.
		//
		// The text document acts as our model, so we have to sync change in the document to our
		// editor and sync changes in the editor back to the document.
		//
		// Remember that a single text document can also be shared between multiple custom
		// editors (this happens for example when you split a custom editor)

		const saveDocumentSubscription = vscode.workspace.onDidSaveTextDocument((e) => {
			console.log('onDidSaveTextDocument');
			updateWebview();
		});

		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
			console.log('onDidChangeTextDocument: ', JSON.stringify(e.document.getText()));
		});

		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			console.log('Disposed');
			changeDocumentSubscription.dispose();
			saveDocumentSubscription.dispose();
		});

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage((e) => {
			switch (e.type) {
				case 'webviewChanged':
					console.log('VS Code recieved message: webviewChanged', JSON.stringify(e.text));
					this.updateTextDocument(document, e.text);
					return;
				case 'initialized':
					console.log('VS Code recieved message: initialized');
					updateWebview();
					return;
			}
		});
	}

	// Get the static html used for the editor webviews.
	private getHtmlForWebview(webview: vscode.Webview): string {
		// Local path to script and css for the webview
		const scriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this.context.extensionUri, 'media', 'markdownEditorInitScript.js')
		);

		const cssUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this.context.extensionUri, 'media', 'markdownEditorStyles.css')
		);

		const ckeditorUri = webview.asWebviewUri(
			vscode.Uri.joinPath(
				this.context.extensionUri,
				...'node_modules/@jdinabox/ckeditor5-build-markdown/build/ckeditor.js'.split('/')
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
					<p>Here goes the initial content of the editor.</p>
				</div>
				
				<script src="${ckeditorUri}"></script>
				<script>
					MarkdownEditor
					.create( document.querySelector( '#editor' ) )
					.then( editor => {
						window.editor = editor
						console.log( "CKEditor instance:", JSON.stringify(editor ));
					} )
					.catch( error => {
						console.error("CKEditor Initialization Error:",  error );
					} );
				</script>
				<!-- CKEditor CSS override has to go after import script -->
				<link href="${cssUri}" rel="stylesheet" />
				<script src="${scriptUri}"></script>
			</body>
			</html>`;
	}

	// Update the text document. Adds all new edits to a queue then calls them in order using .then
	private updateTextDocument(document: vscode.TextDocument, text: any) {
		// Standardize text EOL character to match document
		// https://code.visualstudio.com/api/references/vscode-api#EndOfLine
		console.log(this.document?.eol);
		if (this.document?.eol == 2) {
			text = text.replace(/(?:\r\n|\r|\n)/g, '\r\n');
		} else {
			text = text.replace(/(?:\r\n|\r|\n)/g, '\n');
		}

		console.log('VS Code started updateTextDocument', JSON.stringify(text));

		if (text != this.document?.getText()) {
			// Just replace the entire document every time for this example extension.
			// A more complete extension should compute minimal edits instead.
			const newEdit = new vscode.WorkspaceEdit();
			newEdit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), text);
			this.editQueue.push(newEdit);
			if (this.editQueueRunning == false) {
				this.editQueueRunning = true;
				this.processEditQueue(this.editQueue);
			}
		}
	}

	private processEditQueue(queue: Array<vscode.WorkspaceEdit>) {
		console.log('VS Code started processEditQueue');
		const edit = queue.shift();
		if (edit != undefined) {
			const text = (edit as any)._edits[0].edit._newText;
			console.log('VS Code started applyEdit', JSON.stringify(text));
			vscode.workspace.applyEdit(edit).then(
				() => {
					console.log('VS Code finished applyEdit', JSON.stringify(text));

					this.processEditQueue(queue);
				},
				() => {
					console.log('VS Code failed applyEdit', JSON.stringify(text));
				}
			);
		} else {
			console.log('VS Code finished processEditQueue');
			this.editQueueRunning = false;
		}
	}
}