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

# Notes

- `.vscodeignore` defines everything needed for the build.
- https://github.com/microsoft/vscode/issues/91473

---

---

---

# Template Readme

# Webpack & Extensions

This is an extension that uses https://webpack.js.org to bundle and minify its sources. Using webpack will help to reduce the install- and startup-time of large extensions because instead of hundreds of files, a single file is produced.

## Configuration

Webpack is configured in the `webpack.config.js`\-file. Find annotation inside the file itself or refer to the excellent webpack documentation: https://webpack.js.org/configuration/. In short, the config-files defines the entry point of the extension, to use TypeScript, to produce a commonjs-module, and what modules not to bundle.

## Scripts

The `scripts`\-section of the `package.json`\-file has entries for webpack. Those compile TypeScript and produce the bundle as well as producing a minified production build. Note, that there is no dedicated TypeScript-script as webpack takes care of that.relo

## More

If you use `vscode-nls` to localize your extension that you likely also use `vscode-nls-dev` to create language bundles at build time. To support webpack, a loader has been added to vscode-nls-dev. Add the section below to the `modules/rules`\-configuration.

```
{
  // vscode-nls-dev loader:
  // * rewrite nls-calls
  loader: 'vscode-nls-dev/lib/webpack-loader',
  options: {
    base: path.join(__dirname, 'src')
}
```

A good sample is the shared config built-in extensions use: [https://github.com/Microsoft/vscode/blob/bf5b0585d2a8759541690b2c564b96cb604ff92e/extensions/shared.webpack.config.js#L29-L51](https://github.com/Microsoft/vscode/blob/bf5b0585d2a8759541690b2c564b96cb604ff92e/extensions/shared.webpack.config.js#L29-L51)
