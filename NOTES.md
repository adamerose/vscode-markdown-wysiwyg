# Scripts

```
# Set up (see https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
npm install -g vsce

(cd ./ckeditor5-build-markdown && npm run build)
vsce package
code --install-extension markdown-editor-0.3.0.vsix

(cd ./ckeditor5-build-markdown && npm start)
```

# Architecture

Implements a `CustomTextEditor` for markdown (.md) files.

Our `CustomTextEditor` implementation (called `MarkdownEditorProvider`) is defined in `markdownEditor.js` and registers a webview to show the user when that editor is active

Communication between the webview and VS Code is done using `vscode.postMessage` and is described [here](https://code.visualstudio.com/api/extension-guides/custom-editors#custom-text-editor)

The following events are defined

editor.keystrokes.seteditor.keystrokes.seteditor.keystrokes.set_swagger-viewerswagger-viewer\_

The method `getHtmlForWebview` defines what this webview looks like, in our case importing and rendering a custom CKEditor5 build for markdown from the folder `ckeditor5-build-markdown`. It then runs `markdownEditorInitScript` inside the webview to register

# TODO

- Fix bugginess of file modified indicator
- Add autolink to CKE editor
- Improve loadtimes using [https://code.visualstudio.com/api/extension-guides/webview#retaincontextwhenhidden](https://code.visualstudio.com/api/extension-guides/webview#retaincontextwhenhidden)
- Remove breadcrumb
  - [https://github.com/microsoft/vscode-extension-samples/issues/369#issuecomment-754231994](https://github.com/microsoft/vscode-extension-samples/issues/369#issuecomment-754231994)
  - [https://vscode-dev-community.slack.com/archives/C74CB59NE/p1644800862386389](https://vscode-dev-community.slack.com/archives/C74CB59NE/p1644800862386389)
- Improve styling to be more like VS Code markdown preview
- Add code formatting
  - [https://github.com/ckeditor/ckeditor5/issues/1354](https://github.com/ckeditor/ckeditor5/issues/1354)
  - [https://github.com/ckeditor/ckeditor5/issues/6309](https://github.com/ckeditor/ckeditor5/issues/6309)
- Support pasting clipboard images like [https://github.com/telesoho/vscode-markdown-paste-image](https://github.com/telesoho/vscode-markdown-paste-image)
  - Will need this [https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html)
  - [https://vscode-dev-community.slack.com/archives/C74CB59NE/p1647204814315079](https://vscode-dev-community.slack.com/archives/C74CB59NE/p1647204814315079)
- TODO - Fix active editor not being correct in case where onDidChangeViewState doesn't fire on initialization.
  - [https://github.com/microsoft/vscode/issues/145648](https://github.com/microsoft/vscode/issues/145648)
- Support DocumentSymbolProvider so that the outline and breadcrumb views aren't blank
  - [https://stackoverflow.com/a/59132169/3620725](https://stackoverflow.com/a/59132169/3620725)
- Support exntended HTML features [https://ckeditor.com/docs/ckeditor5/latest/features/markdown.html#extending-formatting-support](https://ckeditor.com/docs/ckeditor5/latest/features/markdown.html#extending-formatting-support)
- Add side margins to editor to match markdown preview style
