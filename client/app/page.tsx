"use client";

import ChatInput from "./components/chat-input";
import UploadFileComponent from "./components/upload-file";
import { FileCheck, ShieldCheck, Database, Layers } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [activeFileName, setActiveFileName] = useState<string | null>(null);

  return (
    <div className="h-full w-full flex flex-col md:flex-row overflow-hidden bg-[#090d16]">
      {/* Sidebar: Document Upload & Workspace Controls */}
      <aside className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-950/40 backdrop-blur-md p-5 flex flex-col justify-between shrink-0 space-y-6 overflow-y-auto">
        <div className="space-y-6 flex flex-col items-center w-full">
          {/* Workspace Title Badge */}
          <div className="w-full space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Workspace Context
              </h2>
              <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Upload your PDF document to query vectors.
            </p>
          </div>

          {/* Upload Component Zone */}
          <UploadFileComponent onFileUploaded={(name) => setActiveFileName(name)} />
        </div>

        {/* Sidebar Info Card */}
        <div className="w-full rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-3 hidden md:block">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>RAG Vector Database</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Documents are processed into chunk embeddings and retrieved dynamically during chat generation for high precision.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[10px] text-emerald-400 font-medium border-t border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Local Backend Server Connected</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area: Chat Interface */}
      <section className="flex-1 h-full overflow-hidden flex flex-col relative bg-gradient-to-b from-[#090d16] to-[#0d1322]">
        <ChatInput />
      </section>
    </div>
  );
}

