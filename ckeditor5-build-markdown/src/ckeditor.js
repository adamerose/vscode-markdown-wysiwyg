import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// CKEditor plugins
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Markdown from '@ckeditor/ckeditor5-markdown-gfm/src/markdown';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';

export default class MarkdownEditor extends ClassicEditorBase {}

// Plugins to include in the build.
MarkdownEditor.builtinPlugins = [
	Autoformat,
	BlockQuote,
	Bold,
	CKFinder,
	CloudServices,
	CodeBlock,
	EasyImage,
	Essentials,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Italic,
	Link,
	List,
	Markdown,
	Paragraph,
	PasteFromOffice,
	SourceEditing,
	Strikethrough,
	Table,
	TableToolbar,
	Underline,
	UploadAdapter,
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
			'imageUpload',
			'blockQuote',
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
