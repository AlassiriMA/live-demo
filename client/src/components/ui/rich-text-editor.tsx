import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

// A simple rich text editor component
// In a real application, you would use a more robust solution like TinyMCE, Quill, or Draft.js
export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter content...',
  className,
  minHeight = '200px'
}: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Handle the content editable div's input
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    onChange(target.innerHTML);
  };

  // Set initial content
  useEffect(() => {
    const editor = document.getElementById('rich-text-editor');
    if (editor && !editor.innerHTML) {
      editor.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="relative">
      <div 
        id="rich-text-editor"
        contentEditable
        className={cn(
          "p-3 border rounded-md w-full overflow-auto focus:outline-none focus:ring-2 focus:ring-primary",
          isFocused ? "border-primary" : "border-border",
          className
        )}
        style={{ minHeight }}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dangerouslySetInnerHTML={{ __html: value }}
      />
      {!value && !isFocused && (
        <div className="absolute top-3 left-3 text-muted-foreground pointer-events-none">
          {placeholder}
        </div>
      )}
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={() => {
            document.execCommand('bold', false);
          }}
          className="p-1 rounded hover:bg-secondary"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => {
            document.execCommand('italic', false);
          }}
          className="p-1 rounded hover:bg-secondary"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => {
            document.execCommand('underline', false);
          }}
          className="p-1 rounded hover:bg-secondary"
          title="Underline"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => {
            document.execCommand('insertOrderedList', false);
          }}
          className="p-1 rounded hover:bg-secondary"
          title="Ordered List"
        >
          OL
        </button>
        <button
          type="button"
          onClick={() => {
            document.execCommand('insertUnorderedList', false);
          }}
          className="p-1 rounded hover:bg-secondary"
          title="Unordered List"
        >
          UL
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) {
              document.execCommand('createLink', false, url);
            }
          }}
          className="p-1 rounded hover:bg-secondary"
          title="Link"
        >
          🔗
        </button>
      </div>
    </div>
  );
}

export default RichTextEditor;