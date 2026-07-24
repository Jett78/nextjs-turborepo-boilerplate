"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import ImageResize from "tiptap-extension-resize-image";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  PlusSquare,
  MinusSquare,
  Columns,
  Trash2,
  Image as ImageIcon,
  Type,
  IndentIncrease,
  IndentDecrease,
} from "lucide-react";
import React from "react";

interface TiptapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize?.replace(/['"]+/g, ""),
        renderHTML: (attributes: { fontSize?: string }) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
});

const textSizes = [
  { label: "Default", value: "" },
  { label: "10px", value: "10px" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
  { label: "36px", value: "36px" },
];

const MenuBar = ({ editor }: { editor: any }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        editor.chain().focus().setImage({ src: url }).run();
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const buttons = [
    {
      icon: <Heading1 size={18} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
      title: "Heading 1",
    },
    {
      icon: <Heading2 size={18} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      title: "Heading 2",
    },
    {
      icon: <Heading3 size={18} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
      title: "Heading 3",
    },
    {
      icon: <Bold size={18} />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      title: "Bold",
    },
    {
      icon: <Italic size={18} />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      title: "Italic",
    },
    {
      icon: <UnderlineIcon size={18} />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
      title: "Underline",
    },
    {
      icon: <List size={18} />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      title: "Bullet List",
    },
    {
      icon: <ListOrdered size={18} />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      title: "Ordered List",
    },
    {
      icon: <IndentIncrease size={18} />,
      onClick: () => editor.chain().focus().sinkListItem("listItem").run(),
      isActive: false,
      title: "Indent",
    },
    {
      icon: <IndentDecrease size={18} />,
      onClick: () => editor.chain().focus().liftListItem("listItem").run(),
      isActive: false,
      title: "Outdent",
    },
    {
      icon: <Quote size={18} />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      title: "Blockquote",
    },
    {
      icon: <AlignLeft size={18} />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: editor.isActive({ textAlign: "left" }),
      title: "Align Left",
    },
    {
      icon: <AlignCenter size={18} />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: editor.isActive({ textAlign: "center" }),
      title: "Align Center",
    },
    {
      icon: <AlignRight size={18} />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: editor.isActive({ textAlign: "right" }),
      title: "Align Right",
    },
    {
      icon: <AlignJustify size={18} />,
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: editor.isActive({ textAlign: "justify" }),
      title: "Align Justify",
    },
    {
      icon: <TableIcon size={18} />,
      onClick: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      title: "Insert Table",
    },
    {
      icon: <PlusSquare size={18} />,
      onClick: () => editor.chain().focus().addRowAfter().run(),
      title: "Add Row After",
    },
    {
      icon: <MinusSquare size={18} />,
      onClick: () => editor.chain().focus().deleteRow().run(),
      title: "Delete Row",
    },
    {
      icon: <Columns size={18} className="rotate-90" />,
      onClick: () => editor.chain().focus().addColumnAfter().run(),
      title: "Add Column After",
    },
    {
      icon: <Columns size={18} className="rotate-90 text-red-500" />,
      onClick: () => editor.chain().focus().deleteColumn().run(),
      title: "Delete Column",
    },
    {
      icon: <Trash2 size={18} className="text-red-500" />,
      onClick: () => editor.chain().focus().deleteTable().run(),
      title: "Delete Table",
    },
    {
      icon: <ImageIcon size={18} />,
      onClick: () => fileInputRef.current?.click(),
      title: "Upload Image",
    },
    {
      icon: <Undo size={18} />,
      onClick: () => editor.chain().focus().undo().run(),
      title: "Undo",
    },
    {
      icon: <Redo size={18} />,
      onClick: () => editor.chain().focus().redo().run(),
      title: "Redo",
    },
  ];

  const getCurrentFontSize = () => {
    const attrs = editor.getAttributes("textStyle");
    return attrs.fontSize || "";
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
      <input
        type="file"
        ref={fileInputRef}
        onChange={addImage}
        accept="image/*"
        className="hidden"
      />
      <div className="relative">
        <select
          value={getCurrentFontSize()}
          onChange={(e) => {
            const size = e.target.value;
            if (size) {
              editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
            } else {
              editor.chain().focus().unsetMark("textStyle").run();
            }
          }}
          className="h-9 px-2 pr-6 rounded-lg text-sm text-gray-600 bg-white border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primarymain/20 cursor-pointer appearance-none"
          title="Text Size"
        >
          {textSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
        <Type size={14} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
      </div>
      <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
      {buttons.map((btn, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.preventDefault();
            btn.onClick();
          }}
          className={cn(
            "p-2 rounded-lg transition-all hover:bg-white hover:shadow-sm",
            btn.isActive
              ? "bg-white text-primarymain shadow-sm"
              : "text-gray-500",
          )}
          title={btn.title}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
};

export function TiptapEditor({
  content = "",
  onChange,
  placeholder = "Start typing...",
  className,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      FontSize,
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      ImageResize,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] max-h-[600px] overflow-auto px-6 py-4",
          className,
        ),
      },
    },
  });

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  return (
    <div className="w-full border border-gray-200 rounded-xl bg-white shadow-xs focus-within:ring-2 focus-within:ring-primarymain/10 focus-within:border-primarymain/50 transition-all">
      <style dangerouslySetInnerHTML={{
        __html: `
          .ProseMirror h1 {
            font-size: 2em;
            font-weight: bold;
            margin-top: 0.67em;
            margin-bottom: 0.67em;
          }
          .ProseMirror h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin-top: 0.83em;
            margin-bottom: 0.83em;
          }
          .ProseMirror h3 {
            font-size: 1.17em;
            font-weight: bold;
            margin-top: 1em;
            margin-bottom: 1em;
          }
          .ProseMirror p {
            margin: 0.5em 0;
          }
          .ProseMirror ul {
            list-style-type: disc;
            padding-left: 2em;
            margin: 0.5em 0;
          }
          .ProseMirror ol {
            list-style-type: decimal;
            padding-left: 2em;
            margin: 0.5em 0;
          }
          .ProseMirror li {
            margin: 0.3em 0;
            line-height: 1.6;
          }
          .ProseMirror li > ul,
          .ProseMirror li > ol {
            margin: 0.2em 0;
            padding-left: 1.5em;
          }
          .ProseMirror ul ul {
            list-style-type: circle;
          }
          .ProseMirror ul ul ul {
            list-style-type: square;
          }
          .ProseMirror table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
          }
          .ProseMirror th,
          .ProseMirror td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
          }
          .ProseMirror th {
            background-color: #f8fafc;
            font-weight: bold;
          }
          .ProseMirror img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
          }
          .ProseMirror blockquote {
            border-left: 3px solid #e2e8f0;
            padding-left: 1em;
            margin: 1em 0;
            color: #64748b;
          }
        `
      }} />
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
