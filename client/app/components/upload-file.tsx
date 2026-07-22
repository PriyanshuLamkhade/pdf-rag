"use client";

import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, RefreshCw, HardDrive } from "lucide-react";
import React, { useState, useRef } from "react";

interface UploadFileComponentProps {
  onFileUploaded?: (fileName: string) => void;
}

const UploadFileComponent: React.FC<UploadFileComponentProps> = ({ onFileUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeFile, setActiveFile] = useState<{ name: string; size: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const uploadFile = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("http://localhost:8000/upload/pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      const fileDetails = {
        name: file.name,
        size: formatFileSize(file.size),
      };

      setActiveFile(fileDetails);
      if (onFileUploaded) {
        onFileUploaded(file.name);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err?.message || "Failed to upload file. Ensure local server is running.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      uploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
      />

      {/* Main Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative group cursor-pointer rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center text-center border-2 border-dashed ${
          isDragging
            ? "border-indigo-400 bg-indigo-500/10 scale-[1.02] shadow-xl shadow-indigo-500/20"
            : activeFile
            ? "border-emerald-500/40 bg-slate-900/80 hover:border-emerald-500/70"
            : "border-slate-700/70 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-slate-900/90 shadow-lg shadow-black/20"
        }`}
      >
        {/* Glow overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {isUploading ? (
          <div className="flex flex-col items-center py-3 space-y-3">
            <div className="relative flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-200">Processing & Indexing PDF...</p>
              <p className="text-xs text-slate-400">Generating vector embeddings for search</p>
            </div>
          </div>
        ) : activeFile ? (
          <div className="flex flex-col items-center w-full py-1 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/10">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="w-full space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-1">
                Active Document
              </span>
              <h3 className="text-sm font-bold text-slate-100 truncate max-w-[220px] mx-auto" title={activeFile.name}>
                {activeFile.name}
              </h3>
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <HardDrive className="w-3 h-3 text-slate-500" /> {activeFile.size}
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs text-indigo-300 font-medium group-hover:text-indigo-200 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Click or drop to replace PDF</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2 space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-md group-hover:scale-110 group-hover:text-indigo-300 transition-all duration-300">
              <Upload className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-200">
                Upload PDF Document
              </h3>
              <p className="text-xs text-slate-400 max-w-[200px]">
                Drag and drop your file here, or <span className="text-indigo-400 font-medium underline underline-offset-2">browse</span>
              </p>
            </div>
            <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 rounded bg-slate-800/60">
              Supports PDF up to 50MB
            </span>
          </div>
        )}
      </div>

      {/* Error notification */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadFileComponent;

