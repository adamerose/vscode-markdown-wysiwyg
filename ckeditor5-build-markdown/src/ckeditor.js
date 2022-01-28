import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// CKEditor plugins
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
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

export default class MarkdownEditor extends ClassicEditorBase {}

// Plugins to include in the build.
MarkdownEditor.builtinPlugins = [
	Alignment,
	Autoformat,
	AutoImage,
	BlockQuote,
	Bold,
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

	// Bind tab key to indentation instead of focusing
	function (editor) {
		editor.keystrokes.set('Tab', (data, cancel) => {
			const command = editor.commands.get('indent');
			if (command.isEnabled) {
				command.execute();
			}
			cancel();
		});

		editor.keystrokes.set('Shift+Tab', (data, cancel) => {
			const command = editor.commands.get('outdent');
			if (command.isEnabled) {
				command.execute();
			}
			cancel();
		});
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
			'horizontalLine',
			'blockQuote',
			'insertImage',
			'insertTable',
			'codeBlock',
			'|',
			'undo',
			'redo',
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
			{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
			{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
			{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
			{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
			{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
			{ model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
			{ model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
		],
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en',
};
