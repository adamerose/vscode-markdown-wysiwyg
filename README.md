npm install -g vsce

(cd ./ckeditor5-build-markdown && npm run build)

vsce package && code --install-extension markdown-editor-0.0.1.vsix

# TODO

*   Fix bugginess of file modified indicator
*   Add autolink to CKE editor
*   Improve loadtimes using [https://code.visualstudio.com/api/extension-guides/webview#retaincontextwhenhidden](https://code.visualstudio.com/api/extension-guides/webview#retaincontextwhenhidden)

# Template Readme

# Webpack & Extensions

This is an extension that uses https://webpack.js.org to bundle and minify its sources. Using webpack will help to reduce the install- and startup-time of large extensions because instead of hundreds of files, a single file is produced.

## Configuration

Webpack is configured in the `webpack.config.js`\-file. Find annotation inside the file itself or refer to the excellent webpack documentation: https://webpack.js.org/configuration/. In short, the config-files defines the entry point of the extension, to use TypeScript, to produce a commonjs-module, and what modules not to bundle.

## Scripts

The `scripts`\-section of the `package.json`\-file has entries for webpack. Those compile TypeScript and produce the bundle as well as producing a minified production build. Note, that there is no dedicated TypeScript-script as webpack takes care of that.relo

## More

If you use `vscode-nls` to localize your extension that you likely also use `vscode-nls-dev` to create language bundles at build time. To support webpack, a loader has been added to vscode-nls-dev. Add the section below to the `modules/rules`\-configuration.

```plaintext
{
  // vscode-nls-dev loader:
  // * rewrite nls-calls
  loader: 'vscode-nls-dev/lib/webpack-loader',
  options: {
    base: path.join(__dirname, 'src')
}
```

A good sample is the shared config built-in extensions use: [https://github.com/Microsoft/vscode/blob/bf5b0585d2a8759541690b2c564b96cb604ff92e/extensions/shared.webpack.config.js#L29-L51](https://github.com/Microsoft/vscode/blob/bf5b0585d2a8759541690b2c564b96cb604ff92e/extensions/shared.webpack.config.js#L29-L51)