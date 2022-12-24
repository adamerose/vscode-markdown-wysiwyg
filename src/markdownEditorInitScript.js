// Get a reference to the VS Code webview api.
// We use this API to post messages back to our extension.

// This was defined in markdownEditor.ts in the HTML snippet initializing CKEditor5. This line just stops IDE complaining.
const editor = window.editor;
editor.timeLastModified = new Date();
editor.savedData = null;

// eslint-disable-next-line no-undef
const vscode = acquireVsCodeApi();
window.vscode = vscode;

editor.debounceActive = false;
const debounceDelay = 5;
const debounce = (callback, wait) => {
	let timeoutId = null;
	return (...args) => {
		window.clearTimeout(timeoutId);
		editor.debounceActive = true;
		timeoutId = window.setTimeout(() => {
			callback.apply(null, args);
			editor.debounceActive = false;
		}, wait);
	};
};

function waitFor(condition, callback) {
	if (!condition()) {
		window.setTimeout(waitFor.bind(null, condition, callback), 50);
	} else {
		callback();
	}
}

/**
 * Render the document in the webview.
 */
function updateContent(/** @type {string} */ text) {
	console.log('updateContent', [JSON.stringify(text)]);
	try {
		// TODO: Check if text is valid markdown
	} catch {
		// TODO: Handle invalid markdown
	}

	// If the new text doesn't match the editor's current text, we need to update it but preserve the selection.
	if (editor.getData() != text) {
		const userSelection = editor.model.document.selection.getFirstRange();

		editor.setData(text);

		editor.model.change((writer) => {
			try {
				writer.setSelection(userSelection);
			} catch {
				// Backup selection to use if userSelection became invalid after setData
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
	const data = editor.getData();

	const dataHasChanged = editor.savedData != data;
	console.log('change:data', [
		JSON.stringify(e),
		JSON.stringify(data),
		JSON.stringify(dataHasChanged),
	]);
	if (dataHasChanged) {
		// Once dataHasChanged is true, we want it to stay true until another save operation is performed.
		// This is how VS Code document dirty flag works, so we have to do the same.
		editor.savedData = null;

		console.log('postMessage (webviewChanged)', [JSON.stringify(data)]);
		editor.timeLastModified = new Date();
		vscode.postMessage({
			type: 'webviewChanged',
			text: data,
		});
	}
});

// Handle messages sent from the extension to the webview
window.addEventListener('message', (event) => {
	console.log('Recieved Message', [JSON.stringify(event.data)]);
	const message = event.data; // The data that the extension sent
	switch (message.type) {
		case 'documentChanged': {
			const text = message.text;
			updateContent(text);

			// Then persist state information.
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
	updateContent(state.text);
}

vscode.postMessage({
	type: 'initialized',
});
