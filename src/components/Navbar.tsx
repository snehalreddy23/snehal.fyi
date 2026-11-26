"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, FileText, Menu, X, ArrowUpRight, Sparkles, Send } from "lucide-react";
import InstagramIcon from "./InstagramIcon";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group py-2">
            <span className="font-semibold text-base sm:text-lg tracking-tight text-white flex items-center">
              snehal<span className="text-blue-500">.fyi</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-400">
            <Link
              href="/"
              className="text-neutral-200 hover:text-white transition"
            >
              Jobs
            </Link>
            <Link
              href="/ats-checker"
              className="text-white hover:text-blue-400 transition flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>ATS Checker</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Free</span>
            </Link>
            <Link
              href="/blog"
              className="hover:text-white transition"
            >
              Resume Playbook
            </Link>
            <Link
              href="/about"
              className="hover:text-white transition"
            >
              About
            </Link>
          </div>

          {/* Right Action: Telegram & Instagram */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href="https://t.me/snehal.fyi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#161618] hover:bg-[#1f1f23] text-neutral-300 hover:text-white border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium transition"
            >
              <Send className="w-3 h-3 text-sky-400" />
              <span>@snehal.fyi</span>
            </a>
            <a
              href="https://instagram.com/snehal.fyi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 px-3.5 py-1.5 rounded-full text-xs font-semibold transition"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@snehal.fyi</span>
            </a>
          </div>

          {/* Mobile hamburger - min 44x44 tap target for thumb */}
          <div className="flex md:hidden items-center">
            <a
              href="https://instagram.com/snehal.fyi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-white text-black text-[11px] font-semibold px-2.5 py-1 rounded-full mr-2"
            >
              <InstagramIcon className="w-3 h-3" />
              <span>Follow</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -mr-2 text-neutral-400 hover:text-white active:bg-white/10 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0c0c0e]/95 backdrop-blur-2xl px-5 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 text-sm font-medium text-white border-b border-white/[0.05]"
          >
            <span>All Openings</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-500" />
          </Link>
          <Link
            href="/ats-checker"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 text-sm font-medium text-blue-400 border-b border-white/[0.05]"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Free ATS Resume Checker</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-500" />
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 text-sm font-medium text-neutral-300 hover:text-white border-b border-white/[0.05]"
          >
            <span>Resume & Interview Playbook</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-500" />
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 text-sm font-medium text-neutral-300 hover:text-white border-b border-white/[0.05]"
          >
            <span>About Snehal Reddy</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-500" />
          </Link>
          <div className="pt-2 space-y-2">
            <a
              href="https://t.me/snehal.fyi"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#161618] border border-white/10 text-white py-2.5 rounded-full font-medium text-xs active:scale-[0.98] transition"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Join Telegram Channel (@snehal.fyi)</span>
            </a>
            <a
              href="https://instagram.com/snehal.fyi"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-full font-semibold text-xs active:scale-[0.98] transition"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow @snehal.fyi on Instagram</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
