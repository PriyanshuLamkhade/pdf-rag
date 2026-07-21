"use client";

import { SendHorizonal } from "lucide-react";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "56px";
    }

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.response,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Failed to connect to server.",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full gap-2 px-2">
      <div className="flex-1  scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-transparent space-y-3 pb-25">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
    msg.role === "user"
      ? "bg-white text-black"
      : "bg-zinc-800 text-white"
  }`}
>
 <div className="prose prose-invert max-w-none overflow-y-auto">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
  >
    {msg.text}
  </ReactMarkdown>
</div>
</div>
          </div>
        ))}
      </div>

    
  <div className="flex items-end gap-2 rounded-3xl border border-zinc-700 bg-zinc-900 p-3 fixed z-20 bottom-2 left-30 right-30 ">
    <textarea
      ref={textareaRef}
      rows={1}
      value={message}
      onChange={handleInput}
      placeholder="Message..."
      className="max-h-[220px] min-h-[56px] flex-1 resize-none overflow-y-auto bg-transparent
      px-2 py-3 text-white placeholder:text-zinc-500 focus:outline-none
      scrollbar-thumb-zinc-400 scrollbar-thin"
    />

    <button
      onClick={sendMessage}
      disabled={!message.trim()}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white cursor-pointer
      text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
    >
      <SendHorizonal size={18} />
    </button>
  </div>
</div>
  );
}