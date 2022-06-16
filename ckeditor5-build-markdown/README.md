This subfolder is based off this guide:

- [https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#scenario-2-building-from-source](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#scenario-2-building-from-source)

Using this as a template:

- [https://github.com/ckeditor/ckeditor5/tree/master/packages/ckeditor5-build-classic](https://github.com/ckeditor/ckeditor5/tree/master/packages/ckeditor5-build-classic)
- [https://github.com/ckeditor/ckeditor5/tree/master/packages/ckeditor5-theme-lark](https://github.com/ckeditor/ckeditor5/tree/master/packages/ckeditor5-theme-lark)

Any changes to the CKEditor5 editor need to be built by running `npm build` in this folder. The root extension code webview reads `ckeditor.js` from the build folder output.

`npm start` was enabled using code from this PR [https://github.com/ckeditor/ckeditor5/pull/10130/files](https://github.com/ckeditor/ckeditor5/pull/10130/files)

Reference

- [https://ckeditor.com/docs/ckeditor5/latest/features/markdown.html](https://ckeditor.com/docs/ckeditor5/latest/features/markdown.html)
- [https://github.github.com/gfm/](https://github.github.com/gfm/)
