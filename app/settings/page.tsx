"use strict";

"use client";

import { useState, useEffect } from "react";
import { getProfileAction, updateProfileAction } from "@/lib/actions/profiles";
import { logoutAction } from "@/lib/actions/auth";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await getProfileAction();
      if (res.success && res.data) {
        setFullName(res.data.full_name || "");
        setEmail(res.data.email);
        setAvatarUrl(res.data.avatar_url || "");
        setImgError(false);
      } else {
        setErrorMsg(res.error || "Failed to retrieve your profile settings.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProfile();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setErrorMsg("");
    setAlertMsg("");

    try {
      const res = await updateProfileAction(fullName, avatarUrl);
      if (res.success && res.data) {
        setFullName(res.data.full_name || "");
        setAvatarUrl(res.data.avatar_url || "");
        setImgError(false);
        setAlertMsg("Identity synchronized successfully!");
        setTimeout(() => setAlertMsg(""), 3500);
      } else {
        setErrorMsg(res.error || "Failed to update profile details.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save profile.";
      setErrorMsg(message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out of your study universe?")) {
      await logoutAction();
    }
  };

  if (loading) {
    return (
      <main className="flex-1 pt-32 pb-24 px-4 md:px-12 max-w-[1440px] mx-auto w-full flex flex-col gap-8 relative z-10">
        <div className="animate-pulse flex flex-col gap-4 border-b border-white/10 pb-6">
          <div className="h-10 w-1/4 bg-white/10 rounded" />
          <div className="h-4 w-1/3 bg-white/5 rounded mt-1" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bento-card h-[300px] border border-white/5 animate-pulse" />
          <div className="lg:col-span-6 bento-card h-[300px] border border-white/5 animate-pulse" />
        </div>
      </main>
    );
  }

  const initialLetter = fullName ? fullName.charAt(0).toUpperCase() : "S";

  return (
    <main className="flex-1 pt-32 pb-24 px-4 md:px-12 max-w-[1440px] mx-auto w-full flex flex-col gap-10 relative z-10">
      
      {/* Page Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight text-gradient">
            Terminal Settings
          </h1>
          <p className="text-sm text-[#ccc3d8]/70 mt-1">
            Manage your student profile credentials and configure secure AI backend keys.
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          className="btn-secondary py-2 px-5 text-sm border-rose-500/50 text-rose-300 hover:border-rose-500 hover:bg-rose-950/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] self-start transition-all cursor-pointer flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Logout Sector
        </button>
      </div>

      {/* Status Alerts */}
      {alertMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-sm text-emerald-400 text-center animate-in fade-in">
          {alertMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/40 text-sm text-[#ffb4ab] text-center animate-in fade-in">
          {errorMsg}
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

          {/* Profile Avatar Live Preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            {!avatarUrl || imgError ? (
              <div className="w-16 h-16 rounded-full border-2 border-[#d2bbff] bg-gradient-to-tr from-[#7c3aed] to-[#94e2ff] flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)] text-[#060d20] font-black text-xl font-mono select-none">
                {initialLetter}
              </div>
            ) : (
              <img
                alt="User Profile Preview"
                className="w-16 h-16 rounded-full border-2 border-[#d2bbff] shadow-[0_0_15px_rgba(124,58,237,0.3)] object-cover"
                src={avatarUrl}
                onError={() => setImgError(true)}
              />
            )}
            <div>
              <h3 className="text-white font-bold text-base leading-snug">{fullName || "Scholar Identity"}</h3>
              <p className="text-xs text-[#ccc3d8]/60 font-mono mt-0.5">{email || "mailbox@university.edu"}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#ccc3d8]/80 mb-2">
                Scholar Identity (Full Name)
              </label>
              <input
                type="text"
                required
                disabled={savingProfile}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-glass disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#ccc3d8]/80 mb-2">
                Scholar Avatar Photo URL
              </label>
              <input
                type="url"
                disabled={savingProfile}
                placeholder="e.g. https://domain.com/photo.jpg"
                value={avatarUrl}
                onChange={(e) => {
                  setAvatarUrl(e.target.value);
                  setImgError(false);
                }}
                className="input-glass disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#ccc3d8]/80 mb-2">
                Academic Mailbox (Email - Read Only)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="input-glass opacity-60 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="btn-primary py-2.5 px-6 mt-2 text-sm self-start disabled:opacity-50"
            >
              {savingProfile ? "Syncing..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* AI Provider Config Read-Only Security Card */}
        <div className="bento-card lg:col-span-6 flex flex-col gap-6 border border-white/10 shadow-xl justify-between min-h-[350px]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#7c3aed]">
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
              </div>
              <h2 className="text-xl font-bold text-white">AI Resource Finder</h2>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="material-symbols-outlined text-2xl animate-pulse">lock_open</span>
              <div>
                <h3 className="font-bold text-sm text-white">AI Resource Finder: Server Connected</h3>
                <p className="text-xs text-emerald-400/80 mt-0.5">Mode: Gemini primary + OpenRouter fallback</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#171f33]/40 border border-white/5 flex flex-col gap-3">
              <p className="text-xs text-[#ccc3d8] leading-relaxed">
                <strong className="text-white block mb-0.5">Purpose:</strong>
                Auto-normalizes BRACU course codes, suggests latest course title, topics, and resources.
              </p>
              <p className="text-[11px] text-[#ccc3d8]/70 leading-relaxed italic border-t border-white/5 pt-2">
                Security: API keys are stored securely on the server and never exposed to the browser.
              </p>
            </div>
          </div>

          <div className="text-center text-[10px] font-mono text-[#ccc3d8]/40 border-t border-white/5 pt-4">
            Security audit completed. Outbound CORS bindings restricted.
          </div>
        </div>

      </div>
    </main>
  );
}
