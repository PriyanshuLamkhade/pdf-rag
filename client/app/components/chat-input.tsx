"use client";

import { SendHorizontal, Bot, User, Sparkles, Copy, Check, FileSearch, Lightbulb, Loader2, ArrowUp, Zap } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  timestamp?: string;
};

const SUGGESTIONS = [
  {
    icon: FileSearch,
    title: "Search Specific Topic",
    query: "Search for information about [enter topic] in the document.",
  },
  {
    icon: Sparkles,
    title: "Ask Context Question",
    query: "What does the document say about [enter topic]?",
  },
  {
    icon: Lightbulb,
    title: "Explain Topic",
    query: "Explain [enter topic] based on the context in the document.",
  },
  {
    icon: Zap,
    title: "Find Key Mentions",
    query: "Where is [enter topic] mentioned and what are the main details?",
  },
];

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async (customQuery?: string) => {
    const queryToSend = customQuery || message;
    if (!queryToSend.trim() || isLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: queryToSend.trim(),
        timestamp: timeStr,
      },
    ]);

    if (!customQuery) {
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: queryToSend.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.response || "No response received.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ **Connection Error**: Unable to reach the backend server (`http://localhost:8000/chat`). Please check if your FastAPI/Python server is running.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto overflow-hidden relative">
      {/* Scrollable Message List / Landing View */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin">
        {messages.length === 0 ? (
          /* Empty / Landing Hero State */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 my-auto py-10">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Powered by Neural Vector Search
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                What would you like to ask?
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Upload a document on the left sidebar to search specific topics or ask questions based on context.
              </p>
            </div>

            {/* Quick Prompt Suggestion Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
              {SUGGESTIONS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => sendMessage(item.query)}
                    className="group p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all duration-200 text-left flex items-start gap-3 shadow-sm hover:shadow-md hover:shadow-indigo-500/10 cursor-pointer"
                  >
                    <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {item.query}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Chat Messages */
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Assistant Avatar */}
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20 mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-xs"
                    : "bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-xs"
                }`}>
                  {/* Markdown Content */}
                  <div className="prose prose-invert max-w-none text-sm leading-relaxed overflow-x-auto">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>

                  {/* Message Footer / Copy button */}
                  <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-white/10 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => handleCopy(msg.text, index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                        title="Copy message"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {/* AI Typing Loader Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-slate-900/90 border border-slate-800 px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span className="text-xs text-slate-400 font-medium">Analyzing document chunks...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Bottom Input Dock */}
      <div className="p-4 shrink-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/95 to-transparent">
        <div className="relative flex items-end gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-2 shadow-2xl backdrop-blur-xl focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your uploaded PDF..."
            className="max-h-[180px] min-h-[44px] flex-1 resize-none overflow-y-auto bg-transparent px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none scrollbar-thin"
          />

          <button
            onClick={() => sendMessage()}
            disabled={!message.trim() || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-all shadow-md shadow-indigo-600/30 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4 font-bold" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between px-2 pt-1.5 text-[11px] text-slate-500">
          <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[10px]">Enter</kbd> to send</span>
          <span>PDF RAG • Vector Context Enabled</span>
        </div>
      </div>
    </div>
  );
}