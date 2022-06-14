import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// CKEditor plugins
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage';
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Clipboard from '@ckeditor/ckeditor5-clipboard/src/clipboard';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
// import CodeBlock from '../ckeditor5-codeblock-with-syntax-highlight/src/codeblock';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert';
// import ImageInsert from '../ckeditor5-insert-image-by-url/insertImageByUrl';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Markdown from '@ckeditor/ckeditor5-markdown-gfm/src/markdown';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';

import './styles.css';
// import './github-markdown.css';

export default class MarkdownEditor extends ClassicEditorBase {}

// Take a list of commands as names or callbacks and execute them in order stopping on the first success.
// The returned function must be of form ( data, cancel ) => { ... }
// See https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editor-Editor.html#member-keystrokes
const attemptCommands =
	(commandNames, stopPropagation = true) =>
	(data, cancel) => {
		for (let commandName of commandNames) {
			if (typeof commandName === 'string') {
				const command = editor.commands.get(commandName);
				if (command?.isEnabled) {
					console.debug(`Executed command ${commandName}.`);
					command.execute();
				} else {
					console.debug(`Command ${commandName} is not enabled.`);
				}
			} else if (typeof commandName === 'function') {
				console.debug(`Executed command ${commandName.toString()}.`);
				commandName();
			}
			break;
		}
		if (stopPropagation) {
			cancel();
		}
	};

// Plugins to include in the build.
MarkdownEditor.builtinPlugins = [
	Alignment,
	Autoformat,
	AutoImage,
	AutoLink,
	BlockQuote,
	Bold,
	Clipboard,
	Code,
	CodeBlock,
	Essentials,
	Heading,
	HorizontalLine,
	Image,
	ImageCaption,
	ImageInsert,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	Indent,
	Italic,
	Link,
	List,
	Markdown,
	Paragraph,
	PasteFromOffice,
	SourceEditing,
	Strikethrough,
	Subscript,
	Superscript,
	Table,
	TableToolbar,
	TextTransformation,
	Underline,

	function (editor) {
		// Set keyboard shortcuts.
		// See https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editingkeystrokehandler-EditingKeystrokeHandler.html#function-set

		editor.keystrokes.set('Tab', attemptCommands(['indent']));
		editor.keystrokes.set('Shift+Tab', attemptCommands(['outdent']));

		// We need to explicitly set this hotkey for pasting plain text.
		// Normally CKEditor relies on the browser to trigger this, but VS Code doesn't have a plain paste hotkey.
		// Recieving this in onDidReceiveMessage will run the paste command, and CKE5 detects shift is pressed and pastes as plaintext.
		// We can't just programmatically trigger a paste from here, this is impossible in modern browsers due to security considerations.
		editor.keystrokes.set(
			'Ctrl+Shift+V',
			attemptCommands(
				[
					() => {
						window.vscode.postMessage({ type: 'plainPaste' });
					},
				],
				true
			)
		);

		// Hotkeys for selecting headers. Ctrl+1 to Ctrl+6 for h1 to h6.
		for (const i of [1, 2, 3, 4, 5, 6]) {
			editor.keystrokes.set(
				`Ctrl+${i}`,
				attemptCommands([() => editor.execute('heading', { value: `heading${i}` })])
			);
		}

		// Ctrl + backtick for paragraph
		editor.keystrokes.set(
			'Ctrl+`',
			attemptCommands([() => editor.execute('heading', { value: 'paragraph' })])
		);
	},
];

// Editor configuration.
MarkdownEditor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'|',
			'link',
			'bulletedList',
			'numberedList',
			'|',
			'blockQuote',
			'insertImage',
			'insertTable',
			'codeBlock',
			'horizontalLine',
			'|',
			'sourceEditing',
		],
	},
	image: {
		toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative'],
	},
	table: {
		contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
	},
	heading: {
		options: [
			{ model: 'paragraph', title: 'Paragraph' },
			{ model: 'heading1', view: 'h1', title: 'Heading 1' },
			{ model: 'heading2', view: 'h2', title: 'Heading 2' },
			{ model: 'heading3', view: 'h3', title: 'Heading 3' },
			{ model: 'heading4', view: 'h4', title: 'Heading 4' },
			{ model: 'heading5', view: 'h5', title: 'Heading 5' },
			{ model: 'heading6', view: 'h6', title: 'Heading 6' },
		],
	},
	codeBlock: {
		languages: [
			{ language: '', label: 'Plain text' },
			{ language: 'c', label: 'C' },
			{ language: 'cs', label: 'C#' },
			{ language: 'cpp', label: 'C++' },
			{ language: 'css', label: 'CSS' },
			{ language: 'diff', label: 'Diff' },
			{ language: 'html', label: 'HTML' },
			{ language: 'java', label: 'Java' },
			{ language: 'javascript', label: 'JavaScript' },
			{ language: 'php', label: 'PHP' },
			{ language: 'python', label: 'Python' },
			{ language: 'ruby', label: 'Ruby' },
			{ language: 'typescript', label: 'TypeScript' },
			{ language: 'xml', label: 'XML' },
		],
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en',
};
