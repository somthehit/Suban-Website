import React, { useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CharacterCount from '@tiptap/extension-character-count';
import { lowlight } from 'lowlight';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeBracketIcon,
  LinkIcon,
  PhotoIcon,
  ListBulletIcon,
  NumberedListIcon,
  ChatBubbleLeftRightIcon,
  PaintBrushIcon,
  TableCellsIcon,
  PlusIcon,
  MinusIcon,
  EyeDropperIcon
} from '@heroicons/react/24/outline';
import {
  Bars3BottomLeftIcon as AlignLeftIcon,
  Bars3Icon as AlignCenterIcon,
  Bars3BottomRightIcon as AlignRightIcon,
  Bars4Icon as AlignJustifyIcon
} from '@heroicons/react/24/outline';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start writing your story...",
  className = ""
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg shadow-md max-w-full h-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
        },
      }),
      Underline,
      Subscript,
      Superscript,
      Highlight.configure({
        multicolor: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-4 overflow-x-auto',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-gray-200 dark:border-gray-700',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-700 font-semibold text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 dark:border-gray-600 px-4 py-2',
        },
      }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none dark:prose-invert min-h-[500px] px-6 py-4',
        spellcheck: 'true',
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB',
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#F97316', '#84CC16', '#06B6D4', '#6366F1'
  ];

  const fontSizes = [
    { label: 'Small', class: 'text-sm' },
    { label: 'Normal', class: 'text-base' },
    { label: 'Large', class: 'text-lg' },
    { label: 'Extra Large', class: 'text-xl' },
    { label: '2X Large', class: 'text-2xl' },
    { label: '3X Large', class: 'text-3xl' },
  ];

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-700">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 mr-3">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Bold"
            >
              <BoldIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Italic"
            >
              <ItalicIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('underline') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Strikethrough"
            >
              <StrikethroughIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Font Size */}
          <div className="relative mr-3">
            <button
              onClick={() => setShowFontSizePicker(!showFontSizePicker)}
              className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Font Size"
            >
              Size
            </button>
            {showFontSizePicker && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[120px]">
                {fontSizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => {
                      // Apply font size via CSS class
                      editor.chain().focus().run();
                      setShowFontSizePicker(false);
                    }}
                    className="block w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Picker */}
          <div className="relative mr-3">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Text Color"
            >
              <div className="flex items-center">
                <EyeDropperIcon className="w-4 h-4 mr-1" />
                <div 
                  className="w-4 h-2 border border-gray-300 rounded"
                  style={{ backgroundColor: currentColor }}
                ></div>
              </div>
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 p-3">
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setCurrentColor(color);
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    editor.chain().focus().setColor(color).run();
                    setCurrentColor(color);
                  }}
                  className="w-full h-8"
                />
              </div>
            )}
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 mr-3">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Align Left"
            >
              <AlignLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Align Center"
            >
              <AlignCenterIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Align Right"
            >
              <AlignRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Justify"
            >
              <AlignJustifyIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 mr-3">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Bullet List"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Numbered List"
            >
              <NumberedListIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 mr-3">
            <select
              onChange={(e) => {
                const level = parseInt(e.target.value);
                if (level === 0) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
                }
              }}
              className="px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
              value={
                editor.isActive('heading', { level: 1 }) ? 1 :
                editor.isActive('heading', { level: 2 }) ? 2 :
                editor.isActive('heading', { level: 3 }) ? 3 :
                editor.isActive('heading', { level: 4 }) ? 4 :
                editor.isActive('heading', { level: 5 }) ? 5 :
                editor.isActive('heading', { level: 6 }) ? 6 : 0
              }
            >
              <option value={0}>Paragraph</option>
              <option value={1}>Heading 1</option>
              <option value={2}>Heading 2</option>
              <option value={3}>Heading 3</option>
              <option value={4}>Heading 4</option>
              <option value={5}>Heading 5</option>
              <option value={6}>Heading 6</option>
            </select>
          </div>

          {/* Special Formatting */}
          <div className="flex items-center gap-1 mr-3">
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('code') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Inline Code"
            >
              <CodeBracketIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Code Block"
            >
              <CodeBracketIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Quote"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('highlight') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Highlight"
            >
              <PaintBrushIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Media & Links */}
          <div className="flex items-center gap-1 mr-3">
            <button
              onClick={setLink}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Add Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              onClick={addImage}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Add Image"
            >
              <PhotoIcon className="w-4 h-4" />
            </button>
            <button
              onClick={insertTable}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Insert Table"
            >
              <TableCellsIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Superscript/Subscript */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-xs ${
                editor.isActive('superscript') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Superscript"
            >
              x²
            </button>
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-xs ${
                editor.isActive('subscript') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Subscript"
            >
              x₂
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative min-h-[500px]">
        <EditorContent 
          editor={editor} 
          className="h-full"
          placeholder={placeholder}
        />
        {!content && (
          <div className="absolute top-4 left-6 text-gray-400 pointer-events-none text-lg">
            {placeholder}
          </div>
        )}
      </div>

      {/* Word Count */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-2 bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
        {editor.storage.characterCount?.words() || 0} words • {editor.storage.characterCount?.characters() || 0} characters
      </div>
    </div>
  );
};

export default RichTextEditor;
