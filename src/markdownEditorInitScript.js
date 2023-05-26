// Get a reference to the VS Code webview api.
// We use this API to post messages back to our extension.

// This was defined in markdownEditor.ts in the HTML snippet initializing CKEditor5. This line just stops IDE complaining.
const editor = window.editor;

// This will store the latest saved data from VS Code
editor.savedData = null;

editor.suppressNextDataChangeEvent = false;

// eslint-disable-next-line no-undef
const vscode = acquireVsCodeApi();
window.vscode = vscode;

// We use this to track whether the document's initial content has been set yet
var initializedFlag = false;

/**
 * Render the document in the webview.
 */
function setEditorContent(/** @type {string} */ text) {
	console.log('setEditorContent', { initializedFlag, text: JSON.stringify(text) });

	// We use setData instead of editor.model.change for initial content otherwise undo history starts with empty content
	if (!initializedFlag) {
		editor.setData(text);
		initializedFlag = true;
		return;
	}

	// If the new text doesn't match the editor's current text, we need to update it but preserve the selection.
	if (editor.getData() != text) {
		// Save selection so we can restore it after replacing the content
		const userSelection = editor.model.document.selection.getFirstRange();

		// Replace all content but calling insertContent with the whole document range as a selection
		const selectionRange = editor.model.createRangeIn(editor.model.document.getRoot());
		const viewFragment = editor.data.processor.toView(text);
		const modelFragment = editor.data.toModel(viewFragment);
		editor.model.insertContent(modelFragment, selectionRange);

		editor.model.change((writer) => {
			try {
				writer.setSelection(userSelection);
			} catch {
				// Backup selection to use if userSelection became invalid after replacing content
				// Usually userSelection should only become invalid if the document got shorter (its now out of bounds)
				// so in that case we should put the cursor at the end of the last line in the document
				let lastElement = editor.model.document
					.getRoot()
					.getChild(editor.model.document.getRoot().childCount - 1);
				editor.model.change((writer) => {
					writer.setSelection(lastElement, 'after');
				});
			}
		});
	}

	// Keep track of this to check if document is really dirty in change:data event
	editor.savedData = editor.getData();
}

// Add listener for user modifying text in the editor
editor.model.document.on('change:data', (e) => {
	// This happens when the even was triggered by documentChanged event rather than user input
	if (editor.suppressNextDataChangeEvent) {
		editor.suppressNextDataChangeEvent = false;
		return;
	}

	const data = editor.getData();
	vscode.postMessage({
		type: 'webviewChanged',
		text: data,
	});

	editor.dirty = true;
});

// Handle messages sent from the extension to the webview
window.addEventListener('message', (event) => {
	console.log('Recieved Message', { 'event.data': JSON.stringify(event.data) });
	const message = event.data; // The data that the extension sent
	switch (message.type) {
		case 'documentChanged': {
			const text = message.text;
			editor.suppressNextDataChangeEvent = true;
			setEditorContent(text);

			// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
			vscode.setState({ text });
		}
		case 'scrollChanged': {
			// TODO
		}
	}
});

// Webviews are normally torn down when not visible and re-created when they become visible again.
// State lets us save information across these re-loads
const state = vscode.getState();
if (state) {
	setEditorContent(state.text);
}

vscode.postMessage({
	type: 'initialized',
});
