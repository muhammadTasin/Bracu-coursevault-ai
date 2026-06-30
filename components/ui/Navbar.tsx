"use strict";

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isLinkActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 h-20 bg-[#0b1326]/40 backdrop-blur-2xl border-b border-white/10 shadow-[0_0_40px_rgba(124,58,237,0.2)]">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(210,187,255,0.5)]">
          CourseVault AI
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/"
          className={`text-xs uppercase tracking-wider font-mono px-3 py-1.5 rounded-lg transition-all duration-300 active:scale-95 ${
            isLinkActive("/") && pathname === "/"
              ? "text-white font-bold border-b-2 border-[#d2bbff] bg-white/10 shadow-[0_0_10px_rgba(124,58,237,0.3)]"
              : "text-[#ccc3d8] hover:text-white hover:bg-white/5"
          }`}
        >
          Landing
        </Link>
        <Link
          href="/dashboard"
          className={`text-xs uppercase tracking-wider font-mono px-3 py-1.5 rounded-lg transition-all duration-300 active:scale-95 ${
            isLinkActive("/dashboard")
              ? "text-white font-bold border-b-2 border-[#d2bbff] bg-white/10 shadow-[0_0_10px_rgba(124,58,237,0.3)]"
              : "text-[#ccc3d8] hover:text-white hover:bg-white/5"
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/settings"
          className={`text-xs uppercase tracking-wider font-mono px-3 py-1.5 rounded-lg transition-all duration-300 active:scale-95 ${
            isLinkActive("/settings")
              ? "text-white font-bold border-b-2 border-[#d2bbff] bg-white/10 shadow-[0_0_10px_rgba(124,58,237,0.3)]"
              : "text-[#ccc3d8] hover:text-white hover:bg-white/5"
          }`}
        >
          Settings
        </Link>
      </div>

      <div className="flex items-center gap-4 text-white">
        <button
          aria-label="Toggle notifications"
          className="hover:bg-white/10 rounded-lg p-2 transition-all duration-300 active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
        </button>

        <Link
          href="/settings"
          className="flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <img
            alt="User Profile"
            className="w-9 h-9 rounded-full border-2 border-[#d2bbff] shadow-[0_0_15px_rgba(124,58,237,0.5)] object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAegx5ywcsUjx17k72K-rLbX89fFLrZtHywpYOgDiCH7W3JbHZx_Ta8VW60YOqVZsR-VjNI8RTrIAs3eNhjrtNyDIsWZVtRB1zb_8HCy8PFY1i95MbWAqvrr0HKuTaZeOXz99FLRoSmdFEnP_-Cun2SeNVxJmA7T2TrwxFV-ulYamgFrDOiAFc-uECMJUfKuk5Ttzy--nC2uk5WOVzFN17aCw57JGvJWa7mv96w0BWRG4bCO95_As3gJVPb522L-6Xk9u0gNjcF7Q"
          />
        </Link>
      </div>
    </nav>
  );
}
