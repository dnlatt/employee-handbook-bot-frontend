// src/components/ChatInput.tsx

"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react"; // icon from lucide-react

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // auto-focus on mount
    inputRef.current?.focus();
  }, []);

  function handleSend() {
    const content = text.trim();
    if (!content) return;
    onSend(content);
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-end gap-2">
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        className="flex-1 resize-none rounded-md border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your message... (Shift+Enter for new line)"
        aria-label="Chat input"
        style={{ minHeight: "48px" }} // lock textarea height
      />
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className={`flex items-center justify-center rounded-md transition-colors ${
          text.trim()
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
        }`}
        style={{ width: "48px", height: "48px" }} // perfect square, aligned
      >
        <Send size={18} />
      </button>
    </div>
  );
}
