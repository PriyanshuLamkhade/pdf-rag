import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Sparkles, FileText, Bot } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Mind AI | Intelligent RAG Document Assistant",
  description: "Chat with your PDF documents seamlessly using AI-powered Retrieval-Augmented Generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-screen antialiased dark`}
    >
      <body className="h-screen w-screen flex flex-col overflow-hidden bg-[#090d16] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        <ClerkProvider>
          {/* Top Glassmorphic Navigation Bar */}
          <header className="h-16 w-full shrink-0 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-30 shadow-lg shadow-black/20">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-[1px] shadow-lg shadow-indigo-500/20">
                <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <FileText className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-tight text-base sm:text-lg bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    PDF Mind <span className="text-indigo-400 font-extrabold">AI</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    <Sparkles className="w-3 h-3 text-indigo-400" /> RAG Engine
                  </span>
                </div>
                <span className="text-xs text-slate-400 hidden sm:block">
                  Document Intelligence Platform
                </span>
              </div>
            </div>

            {/* Status & Auth Section */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>System Online</span>
              </div>

              <Show when="signed-out">
                <div className="flex items-center gap-3">
                  <SignInButton>
                    <button className="text-slate-300 hover:text-white font-medium text-sm px-3 py-2 transition-colors cursor-pointer">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs sm:text-sm h-9 px-4 rounded-xl shadow-md shadow-indigo-600/25 transition-all hover:shadow-indigo-600/40 hover:-translate-y-0.5 cursor-pointer">
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              </Show>

              <Show when="signed-in">
                <div className="flex items-center gap-3">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "h-9 w-9 ring-2 ring-indigo-500/30 hover:ring-indigo-500/60 transition-all",
                      },
                    }}
                  />
                </div>
              </Show>
            </div>
          </header>

          {/* Main App Workspace Area */}
          <main className="flex-1 flex flex-col overflow-hidden relative">
            <Show when="signed-out">
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-xl flex flex-col items-center space-y-6">
                  <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10">
                    <Bot className="h-8 w-8" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    Unlock Instant Insights from Your PDFs
                  </h1>
                  <p className="text-slate-400 text-base leading-relaxed">
                    Upload complex documents and ask questions in natural language. Powered by state-of-the-art vector search and neural LLMs.
                  </p>
                  <div className="pt-2 flex items-center gap-4">
                    <SignUpButton>
                      <button className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm h-11 px-6 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 cursor-pointer">
                        Sign Up to Get Started
                      </button>
                    </SignUpButton>
                  </div>
                </div>
              </div>
            </Show>

            <Show when="signed-in">
              {children}
            </Show>
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}

