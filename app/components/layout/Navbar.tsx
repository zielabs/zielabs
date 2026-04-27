"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="mx-auto mt-4 max-w-7xl px-4 md:px-8"
      >
        <div className={cn(
          "flex items-center justify-between rounded-full border px-6 py-3 transition-all duration-700",
          scrolled 
            ? "border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
            : "border-white/5 bg-zinc-950/30 backdrop-blur-sm"
        )}>
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <Image 
              src="/object/logo_zielabs.png" 
              alt="Zielabs Logo" 
              width={24} 
              height={24} 
              className="object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-100 group-hover:text-white transition-colors">
              Zielabs
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center md:flex relative">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 group"
                >
                  <span className={cn(
                    "relative z-10 text-xs font-bold uppercase tracking-widest transition-colors duration-300",
                    isActive ? "text-zinc-950" : "text-zinc-400 group-hover:text-zinc-200"
                  )}>
                    {link.label}
                  </span>
                  
                  {/* Animated Active Pill — layoutId makes it slide between links */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 z-0 rounded-full bg-[#50C878] shadow-[0_0_15px_rgba(80,200,120,0.3)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-full p-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 md:hidden transition-colors"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile menu — animated */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 rounded-3xl border border-white/10 bg-zinc-950/95 p-4 backdrop-blur-xl md:hidden shadow-2xl"
            >
              {NAV_LINKS.map((link, idx) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-2xl px-4 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300",
                        isActive
                          ? "bg-[#50C878]/10 text-[#50C878]"
                          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
