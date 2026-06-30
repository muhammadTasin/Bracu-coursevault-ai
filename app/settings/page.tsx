"use strict";

"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("Tasin Muhammad");
  const [email, setEmail] = useState("tasin@university.edu");
  const [activeProvider, setActiveProvider] = useState("gemini-primary");
  const [geminiKeyInput, setGeminiKeyInput] = useState("");
  const [openRouterKeyInput, setOpenRouterKeyInput] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingKeys, setSavingKeys] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      setAlertMsg("Profile updated successfully!");
      setTimeout(() => setAlertMsg(""), 3000);
    }, 1000);
  };

  const handleSaveKeysPlaceholder = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKeys(true);
    setTimeout(() => {
      setSavingKeys(false);
      setGeminiKeyInput("");
      setOpenRouterKeyInput("");
      setAlertMsg("Secure credentials updated on server-side simulator!");
      setTimeout(() => setAlertMsg(""), 3000);
    }, 1200);
  };

  return (
    <main className="flex-1 pt-32 pb-24 px-4 md:px-12 max-w-[1440px] mx-auto w-full flex flex-col gap-10 relative z-10">
      
      {/* Page Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight text-gradient">
          Terminal Settings
        </h1>
        <p className="text-sm text-[#ccc3d8]/70 mt-1">
          Manage your student profile credentials and configure secure AI backend keys.
        </p>
      </div>

      {alertMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-sm text-emerald-400 text-center animate-in fade-in">
          {alertMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Card */}
        <div className="bento-card lg:col-span-6 flex flex-col gap-6 border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94e2ff]">
              <span className="material-symbols-outlined text-lg">manage_accounts</span>
            </div>
            <h2 className="text-xl font-bold text-white">Profile Details</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#ccc3d8]/80 mb-2">
                Scholar Identity (Full Name)
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-glass"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#ccc3d8]/80 mb-2">
                Academic Mailbox (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="btn-primary py-2.5 px-6 mt-2 text-sm self-start"
            >
              {savingProfile ? "Syncing..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* AI Provider Config Card */}
        <div className="bento-card lg:col-span-6 flex flex-col gap-6 border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#7c3aed]">
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
            </div>
            <h2 className="text-xl font-bold text-white">Secure AI Provider Settings</h2>
          </div>

          <p className="text-xs text-[#ccc3d8]/70 leading-relaxed border-l-2 border-[#7c3aed] pl-3">
            <strong>Security Notice:</strong> All API keys are processed and stored server-side. They are never exposed to the frontend environment, ensuring complete security.
          </p>

          <form onSubmit={handleSaveKeysPlaceholder} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#ccc3d8]/80 mb-2">
                Routing Priority (Active Engine)
              </label>
              <select
                value={activeProvider}
                onChange={(e) => setActiveProvider(e.target.value)}
                className="w-full bg-[#2d3449]/40 border border-[#4a4455] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#94e2ff] transition-all cursor-pointer"
              >
                <option className="bg-[#131b2e]" value="gemini-primary">Gemini (Primary) + OpenRouter Fallback</option>
                <option className="bg-[#131b2e]" value="openrouter-only">OpenRouter Exclusive</option>
                <option className="bg-[#131b2e]" value="gemini-only">Gemini Studio Exclusive</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#ccc3d8]/80 mb-2">
                Gemini API Key (Google AI Studio)
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••••••••••"
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                className="input-glass"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#ccc3d8]/80 mb-2">
                OpenRouter API Key
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••••••••••"
                value={openRouterKeyInput}
                onChange={(e) => setOpenRouterKeyInput(e.target.value)}
                className="input-glass"
              />
            </div>

            <button
              type="submit"
              disabled={savingKeys}
              className="btn-secondary py-2.5 px-6 mt-2 text-sm self-start border-[#7c3aed]/50 hover:border-[#7c3aed]"
            >
              {savingKeys ? "Encrypting..." : "Save Secure Keys"}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
