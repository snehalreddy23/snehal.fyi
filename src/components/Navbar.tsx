"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, FileText, Menu, X, ArrowUpRight } from "lucide-react";
import InstagramIcon from "./InstagramIcon";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/75 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
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

          {/* Right Action: Instagram Follow */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://instagram.com/snehal.fyi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 px-3.5 py-1.5 rounded-full text-xs font-medium transition"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@snehal.fyi</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-neutral-400 hover:text-white transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-black px-4 pt-2 pb-5 space-y-3 text-sm">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-200 hover:text-white font-medium"
          >
            All Openings
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-300 hover:text-white font-medium"
          >
            Resume & Interview Guides
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-300 hover:text-white font-medium"
          >
            About Snehal Reddy
          </Link>
          <div className="pt-2 border-t border-white/[0.08]">
            <a
              href="https://instagram.com/snehal.fyi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-full font-semibold text-xs"
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
