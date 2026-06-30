"use client";

import { useState } from "react";
import Link from "next/link";
import { signupAction } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 15MB File Size check
      if (avatarFile && avatarFile.size > 15 * 1024 * 1024) {
        setErrorMsg("Photo file size must be less than 15MB.");
        setLoading(false);
        return;
      }

      let uploadedAvatarUrl = "";

      if (avatarFile) {
        const supabase = createClient();
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile);

        if (uploadError) {
          throw new Error("Failed to upload photo: " + uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        uploadedAvatarUrl = publicUrl;
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatarUrl", uploadedAvatarUrl);

      const res = await signupAction(formData);
      if (res && !res.success) {
        setErrorMsg(res.error || "Failed to create account.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="absolute inset-0 bg-[#060d20]/50 backdrop-blur-sm pointer-events-none" />
      
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-white/20 shadow-2xl relative z-10 flex flex-col gap-6 animate-in fade-in duration-500">
        
        {/* Header Icon & Brand */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#94e2ff] flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <span className="material-symbols-outlined text-2xl text-[#060d20] font-bold">person_add</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-2">
            Establish Sector
          </h1>
          <p className="text-xs text-[#ccc3d8]/60 uppercase tracking-widest font-mono">
            Register CourseVault AI Account
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/40 text-xs text-[#ffb4ab] text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#ccc3d8] mb-2">
              Full Scholar Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tasin Muhammad"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-glass"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#ccc3d8] mb-2">
              Scholar Avatar Photo (Optional, Max 15MB)
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAvatarFile(file);
                }
              }}
              className="w-full bg-[#2d3449]/40 border border-[#4a4455] rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#94e2ff] transition-all file:mr-4 file:py-1.5 file:px-3.5 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#94e2ff]/15 file:text-[#94e2ff] file:hover:bg-[#94e2ff]/25 file:cursor-pointer cursor-pointer disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#ccc3d8] mb-2">
              University Email
            </label>
            <input
              type="email"
              required
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-glass"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#ccc3d8] mb-2">
              Security Key (Password)
            </label>
            <input
              type="password"
              required
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-glass"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 mt-2 text-sm uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#060d20] border-t-transparent rounded-full animate-spin" />
                Establishing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">how_to_reg</span>
                Create Smart Wallet
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#ccc3d8]/70 pt-4 border-t border-white/10">
          <p>
            Already have a registered sector?{" "}
            <Link href="/auth/login" className="text-[#94e2ff] hover:underline font-bold">
              Access Vault
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
