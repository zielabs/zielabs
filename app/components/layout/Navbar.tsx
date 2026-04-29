// app/components/layout/Navbar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Navbar responsif yang theme-aware (Light/Dark).
// ThemeToggle disisipkan di area kanan navbar, sebelum tombol hamburger mobile.
// Warna menggunakan dark: Tailwind variants agar otomatis berganti tema.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Testimonials", href: "/#testimonials" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 20);

      // Sembunyikan navbar jika scroll ke bawah melewati 100px, munculkan jika scroll ke atas
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
        setMobileOpen(false); // Tutup menu mobile jika sedang terbuka
      } else if (currentScrollY < lastScrollY) {
        setIsHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Admin halaman tidak menggunakan Navbar publik
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isHidden ? -120 : 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="mx-auto mt-4 max-w-7xl px-4 md:px-8"
      >
        {/* ── Navbar Bar ─────────────────────────────────────────────── */}
        <div className={cn(
          "flex items-center justify-between rounded-full border px-6 py-3 transition-all duration-500",
          scrolled
            // Scrolled: glassmorphism kuat, shadow
            ? "border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-md dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            // Top: subtle transparency
            : "border-zinc-200/50 dark:border-white/5 bg-white/50 dark:bg-zinc-950/30 backdrop-blur-sm"
        )}>
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/object/logo_zielabs.png"
              alt="Zielabs Logo"
              width={24}
              height={24}
              className="object-contain transition-transform duration-500 group-hover:scale-110"
              priority
              loading="eager"
            />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100 group-hover:text-[#50C878] transition-colors">
              Zielabs
            </span>
          </Link>

          {/* ── Desktop Links ─────────────────────────────────────────── */}
          <div className="hidden items-center md:flex relative">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 group"
                >
                  <span className={cn(
                    "relative z-10 text-xs font-bold uppercase tracking-widest transition-colors duration-300",
                    // Active: teks hitam/putih di atas pill hijau
                    isActive
                      ? "text-zinc-950 dark:text-zinc-950"
                      : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"
                  )}>
                    {link.label}
                  </span>

                  {/* Active Pill — layoutId agar bisa slide antar link */}
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

          {/* ── Right Controls: ThemeToggle + Mobile Button ────────────── */}
          <div className="flex items-center gap-2">
            {/* ThemeToggle — terlihat di semua breakpoint */}
            <ThemeToggle />

            {/* Hamburger — hanya di mobile */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-full p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 md:hidden transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu (Animated) ──────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="mt-4 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 p-4 backdrop-blur-xl md:hidden shadow-lg dark:shadow-2xl"
            >
              {NAV_LINKS.map((link, idx) => {
                const isActive =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: idx * 0.05,
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-2xl px-4 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300",
                        isActive
                          ? "bg-[#50C878]/10 text-[#50C878]"
                          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-800 dark:hover:text-zinc-200"
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
