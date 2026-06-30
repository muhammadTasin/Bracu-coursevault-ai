"use strict";

"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

// Load Three.js 3D folder canvas dynamically to avoid SSR errors
const FolderUniverse = dynamic(
  () => import("@/components/ui/FolderUniverse"),
  { ssr: false }
);

export default function LandingPage() {
  return (
    <main className="flex-1 pt-32 pb-24 px-4 md:px-12 max-w-[1440px] mx-auto w-full flex flex-col gap-16 relative z-10">
      
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[500px]">
        <div className="lg:col-span-6 flex flex-col gap-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold neon-text leading-tight">
            Your AI-Powered<br />Study Universe
          </h1>
          <p className="text-lg md:text-xl text-[#dbe2fd]/90 max-w-xl leading-relaxed drop-shadow-md">
            Organize university courses, discover resources with AI, and save every important link inside beautiful, smart course folders.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link href="/dashboard" className="btn-primary">
              <span className="material-symbols-outlined font-bold">rocket_launch</span>
              Open Dashboard
            </Link>
            <Link href="/auth/login" className="btn-secondary">
              <span className="material-symbols-outlined">account_circle</span>
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Cinematic 3D Scene */}
        <div className="lg:col-span-6 relative h-[400px] lg:h-[500px] w-full flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 scale-110">
            <FolderUniverse />
          </div>
        </div>
      </section>

      {/* Feature Galaxy Bento Showcase */}
      <section className="flex flex-col gap-10">
        <div className="flex items-center gap-4 border-b border-white/20 pb-4">
          <h2 className="text-2xl md:text-3xl font-black text-white relative inline-block tracking-tight">
            My Course Galaxy
            <span className="absolute -bottom-4 left-0 w-1/2 h-[3px] bg-gradient-to-r from-[#7c3aed] to-[#94e2ff] shadow-[0_0_15px_rgba(148,226,255,0.6)]"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5">
          
          {/* Sample Course Card (CSE 427) */}
          <div className="bento-card bento-card-hover md:col-span-6 lg:col-span-8 group shadow-lg">
            {/* Subtle background icons */}
            <span className="material-symbols-outlined absolute -top-4 -right-4 text-[150px] text-white/5 group-hover:text-[#7c3aed]/10 transition-colors duration-500 transform rotate-12 blur-sm select-none">
              code
            </span>

            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#94e2ff] transition-colors drop-shadow-md">
                    Machine Learning
                  </h3>
                  <p className="text-xs font-mono text-[#ccc3d8]/70 mt-1 uppercase tracking-wider">
                    CSE 427 • University Core
                  </p>
                </div>
                <div className="text-white/50 bg-white/5 p-2 rounded-full">
                  <span className="material-symbols-outlined text-[20px]">folder_open</span>
                </div>
              </div>

              <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl">
                Comprehensive folder resources including lecture notes, assignments, code scripts, and AI-curated study guides.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="glass-chip border-[#7c3aed]/40 shadow-[0_0_10px_rgba(124,58,237,0.2)]">ML</span>
                <span className="glass-chip border-[#94e2ff]/40 shadow-[0_0_10px_rgba(148,226,255,0.2)]">AI</span>
                <span className="glass-chip">Undergrad</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/10 mt-auto">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1 text-xs font-mono text-white bg-white/5 px-2 py-1 rounded" title="12 Links Saved">
                    <span className="material-symbols-outlined text-[16px] text-[#7c3aed]">link</span> 12
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono text-white bg-white/5 px-2 py-1 rounded" title="3 Playlists">
                    <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">play_circle</span> 3
                  </div>
                </div>

                <Link href="/dashboard" className="btn-primary py-2 px-4 text-xs shadow-none">
                  Open Demo Folder
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Prompt to Add Course Card */}
          <Link href="/dashboard" className="bento-card bento-card-hover md:col-span-6 lg:col-span-4 flex flex-col items-center justify-center gap-5 text-center border-dashed border-2 border-white/20 hover:border-[#7c3aed]/50 cursor-pointer bg-white/5 group">
            <div className="w-16 h-16 rounded-full bg-[#7c3aed]/20 flex items-center justify-center group-hover:bg-[#7c3aed]/30 transition-all border border-[#7c3aed]/40 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              <span className="material-symbols-outlined text-3xl text-white font-bold">add</span>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">Add Another Subject</h3>
              <p className="text-xs font-mono text-[#ccc3d8]/60 tracking-wider">Initialize a new secure smart folder</p>
            </div>
            <span className="btn-secondary py-2 px-5 text-xs w-full max-w-[200px] border-white/20">
              Create Folder
            </span>
          </Link>

        </div>
      </section>

      {/* Auxiliary Bento Showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Recent Resources */}
        <div className="bento-card lg:col-span-4 flex flex-col gap-4 border border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg md:text-xl font-bold text-white">Recent Resources</h3>
            <span className="material-symbols-outlined text-[#94e2ff]">history</span>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#ffb4ab]/20 flex items-center justify-center text-[#ffb4ab] border border-[#ffb4ab]/30">
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">Neural Networks Backprop</p>
                <p className="text-[#ccc3d8]/60 text-[10px] truncate">youtube.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#7c3aed]/20 flex items-center justify-center text-[#d2bbff] border border-[#7c3aed]/30">
                <span className="material-symbols-outlined text-[18px]">description</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">Machine Learning Syllabus.pdf</p>
                <p className="text-[#ccc3d8]/60 text-[10px] truncate">Document notes</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggested */}
        <div className="bento-card lg:col-span-5 flex flex-col gap-4 border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#94e2ff] animate-pulse">auto_awesome</span>
            <h3 className="text-lg md:text-xl font-bold text-white">AI suggestions for you</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
            <div className="bg-[#222a3e]/50 p-4 rounded-xl border border-white/10 hover:border-[#7c3aed]/30 transition-colors flex flex-col justify-between group cursor-pointer relative overflow-hidden">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#94e2ff] text-[16px]">book</span>
                  <span className="text-[10px] text-[#ccc3d8]/60 uppercase font-mono">Article</span>
                </div>
                <h4 className="text-white font-bold text-xs leading-snug group-hover:text-[#d2bbff] transition-colors">
                  Gradient Descent Intuition
                </h4>
              </div>
              <span className="mt-3 text-[10px] font-mono flex items-center gap-0.5 text-white/50 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[14px]">add</span> Add Suggestion
              </span>
            </div>

            <div className="bg-[#222a3e]/50 p-4 rounded-xl border border-white/10 hover:border-[#94e2ff]/30 transition-colors flex flex-col justify-between group cursor-pointer relative overflow-hidden">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[16px]">smart_display</span>
                  <span className="text-[10px] text-[#ccc3d8]/60 uppercase font-mono">Video</span>
                </div>
                <h4 className="text-white font-bold text-xs leading-snug group-hover:text-[#94e2ff] transition-colors">
                  SVM Kernel Trick Simplified
                </h4>
              </div>
              <span className="mt-3 text-[10px] font-mono flex items-center gap-0.5 text-white/50 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[14px]">add</span> Add Suggestion
              </span>
            </div>
          </div>
        </div>

        {/* Quick Add Link */}
        <div className="bento-card lg:col-span-3 flex flex-col items-center justify-center gap-4 border border-white/10 bg-white/5 text-center group">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#7c3aed]/20 group-hover:border-[#7c3aed]/40 transition-all duration-300 transform group-hover:scale-105">
            <span className="material-symbols-outlined text-2xl text-white/70 group-hover:text-white">link</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Quick Add Link</h3>
            <p className="text-[10px] text-[#ccc3d8]/50 mt-1">Paste any resource URL directly</p>
          </div>
          <Link href="/dashboard" className="btn-primary w-full py-2 text-xs shadow-none hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            Paste Link
          </Link>
        </div>

      </section>
    </main>
  );
}
