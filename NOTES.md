# Scripts

```
# Set up (see https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
npm install -g vsce

# Build and package
(cd ./ckeditor5-build-markdown && npm run build)
# Remember to increment the version in package.json
vsce package
code --install-extension $(find -name "markdown-wysiwyg*" | tail -1)

# Publish extension
vsce publish

# Run CKEditor5 subproject
(cd ./ckeditor5-build-markdown && npm start)
```

# Architecture

Implements a `CustomTextEditor` for markdown (.md) files.

Our `CustomTextEditor` implementation (called `MarkdownEditorProvider`) is defined in `markdownEditor.js` and registers a webview to show the user when that editor is active

Communication between the webview and VS Code is done using `vscode.postMessage` and is described [here](https://code.visualstudio.com/api/extension-guides/custom-editors#custom-text-editor)

The method `getHtmlForWebview` defines what this webview looks like, in our case importing and rendering a custom CKEditor5 build for markdown from the folder `ckeditor5-build-markdown`. It then runs `markdownEditorInitScript` inside the webview to register.

# TODO

- Add autolink to CKE editor
- Sync scroll position (to plain editor and to markdown preview)
  - Do it like this [https://stackoverflow.com/questions/54556208/scroll-to-marker-in-ckeditor-5](https://stackoverflow.com/questions/54556208/scroll-to-marker-in-ckeditor-5)
  - And need this for importing that function [https://stackoverflow.com/questions/61307979/how-to-import-npm-packages-in-vs-code-webview-extension-development](https://stackoverflow.com/questions/61307979/how-to-import-npm-packages-in-vs-code-webview-extension-development)
- Remove breadcrumb
  - [https://github.com/microsoft/vscode-extension-samples/issues/369#issuecomment-754231994](https://github.com/microsoft/vscode-extension-samples/issues/369#issuecomment-754231994)
  - [https://vscode-dev-community.slack.com/archives/C74CB59NE/p1644800862386389](https://vscode-dev-community.slack.com/archives/C74CB59NE/p1644800862386389)
- Add code formatting
  - [https://github.com/ckeditor/ckeditor5/issues/1354](https://github.com/ckeditor/ckeditor5/issues/1354)
  - [https://github.com/ckeditor/ckeditor5/issues/6309](https://github.com/ckeditor/ckeditor5/issues/6309)
  - [https://github.com/ckeditor/ckeditor5/issues/436](https://github.com/ckeditor/ckeditor5/issues/436)
  - [https://github.com/ckeditor/ckeditor5/issues/5769](https://github.com/ckeditor/ckeditor5/issues/5769)
  - I couldnt get this working without errors
    - [https://github.com/regischen/CKEditor5-CodeBlock-With-Syntax-Highlight](https://github.com/regischen/CKEditor5-CodeBlock-With-Syntax-Highlight)
- Support pasting clipboard images like [https://github.com/telesoho/vscode-markdown-paste-image](https://github.com/telesoho/vscode-markdown-paste-image)
  - Will need this [https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html)
  - [https://vscode-dev-community.slack.com/archives/C74CB59NE/p1647204814315079](https://vscode-dev-community.slack.com/archives/C74CB59NE/p1647204814315079)
- Support DocumentSymbolProvider so that the outline and breadcrumb views aren't blank
  - [https://stackoverflow.com/a/59132169/3620725](https://stackoverflow.com/a/59132169/3620725)
  - Need this upstream issue completed first: [https://github.com/microsoft/vscode/issues/97095](https://github.com/microsoft/vscode/issues/97095)
- Support extended HTML features [https://ckeditor.com/docs/ckeditor5/latest/features/markdown.html#extending-formatting-support](https://ckeditor.com/docs/ckeditor5/latest/features/markdown.html#extending-formatting-support)
- Figure out how to toggle between editors without saving and without showing a popup prompt
- Improve support for keyboard shortcuts, eg. the shortcut should automatically appear in brackets when hovering the toolbar button
  - [https://ckeditor.com/docs/ckeditor5/latest/framework/guides/plugins/abbreviation-plugin/abbreviation-plugin-level-1.html](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/plugins/abbreviation-plugin/abbreviation-plugin-level-1.html)
  - How does it work for built in shortcuts?  [https://github.com/ckeditor/ckeditor5/blob/7dea975058cfa1bd0c6b6b42a96187c3706547d9/packages/ckeditor5-basic-styles/src/bold/boldui.ts#L41](https://github.com/ckeditor/ckeditor5/blob/7dea975058cfa1bd0c6b6b42a96187c3706547d9/packages/ckeditor5-basic-styles/src/bold/boldui.ts#L41)
- Fix the following markdown not being shown as bullets

```
- one

- two
- three
```
