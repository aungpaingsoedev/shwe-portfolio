"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading2,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadAdminFile } from "@/components/admin/storage-upload-field";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write content…",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[var(--accent)] underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl max-w-full" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[220px] px-4 py-3 focus:outline-none text-[var(--foreground)]",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          "min-h-[280px] rounded-2xl border border-[var(--border)] bg-[var(--surface)]",
          className,
        )}
      />
    );
  }

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previous || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const { url } = await uploadAdminFile(file, {
          folder: "editor",
          name: file.name,
          library: true,
        });
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        const fallback = window.prompt(
          `${message}\nPaste an image URL instead:`,
        );
        if (fallback) editor.chain().focus().setImage({ src: fallback }).run();
      }
    };
    input.click();
  };

  const tools = [
    {
      label: "Bold",
      icon: Bold,
      active: editor.isActive("bold"),
      action: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: Italic,
      active: editor.isActive("italic"),
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Heading",
      icon: Heading2,
      active: editor.isActive("heading", { level: 2 }),
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Bullet list",
      icon: List,
      active: editor.isActive("bulletList"),
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered list",
      icon: ListOrdered,
      active: editor.isActive("orderedList"),
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Quote",
      icon: Quote,
      active: editor.isActive("blockquote"),
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    { label: "Link", icon: Link2, active: editor.isActive("link"), action: setLink },
    { label: "Image", icon: ImageIcon, active: false, action: addImage },
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]",
        className,
      )}
    >
      <div className="flex flex-wrap gap-1 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_90%,var(--accent-soft))] p-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.label}
              type="button"
              title={tool.label}
              onClick={tool.action}
              className={cn(
                "rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]",
                tool.active && "bg-[var(--accent-soft)] text-[var(--accent)]",
              )}
            >
              <Icon className="size-4" strokeWidth={1.75} />
            </button>
          );
        })}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
