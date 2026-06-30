"use strict";

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await loginAction(formData);
      if (res && !res.success) {
        setErrorMsg(res.error || "Invalid credentials.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed.");
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
            <span className="material-symbols-outlined text-2xl text-[#060d20] font-bold">lock</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-2">
            Secure Mission Control
          </h1>
          <p className="text-xs text-[#ccc3d8]/60 uppercase tracking-widest font-mono">
            Enter CourseVault AI
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/40 text-xs text-[#ffb4ab] text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
              placeholder="••••••••"
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
                Authorizing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">login</span>
                De-encrypt Vault
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#ccc3d8]/70 pt-4 border-t border-white/10 flex flex-col gap-2">
          <p>
            New to the study universe?{" "}
            <Link href="/auth/signup" className="text-[#94e2ff] hover:underline font-bold">
              Register Sector
            </Link>
          </p>
          <Link href="/dashboard" className="text-[#ccc3d8]/40 hover:text-white transition-colors">
            Access Demo Environment
          </Link>
        </div>

      </div>
    </main>
  );
}
