"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative border-t border-white/5 bg-[#050505] overflow-hidden">
      {/* Glow ambient at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[radial-gradient(ellipse_at_bottom,rgba(80,200,120,0.05),transparent_60%)] pointer-events-none" />
      <div className="scanlines" />

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 relative z-10">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/object/logo_zielabs.png" 
                alt="Zielabs Logo" 
                width={28} 
                height={28} 
                className="object-contain"
              />
              <span className="text-lg font-bold uppercase tracking-[0.2em] text-zinc-100">
                Zielabs
              </span>
            </div>
            <p className="text-xs text-zinc-500 tracking-widest uppercase font-medium text-center md:text-left max-w-xs">
              Engineering Digital Excellence<br/>
              <span className="text-zinc-600 mt-1 block">Jakarta, Indonesia</span>
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a href="https://wa.me/628998143723" target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-[#50C878] transition-colors link-underline pb-1">WhatsApp</a>
            <a href="https://www.instagram.com/zielabs_/" className="text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-[#50C878] transition-colors link-underline pb-1">Instagram</a>
            <a href="mailto:[EMAIL_ADDRESS]" className="text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-[#50C878] transition-colors link-underline pb-1">Email</a>
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center md:items-end gap-2 text-xs font-medium text-zinc-600 tracking-wider">
            <p>&copy; {new Date().getFullYear()} Zielabs.</p>
            <p>All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
