// app/components/ui/FloatingContactButton.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Tombol "Hubungi Kami" yang selalu terlihat di pojok kanan bawah layar.
// Mengarah ke halaman about#contact atau bisa diubah sesuai kebutuhan.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Mail, Phone } from "lucide-react";

export default function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Tampilkan tombol setelah sedikit delay agar tidak langsung muncul saat halaman load
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const contacts = [
    {
      id: "email",
      icon: <Mail className="size-4" />,
      label: "Email Kami",
      href: "mailto:hello@zielabs.com",
      color: "hover:bg-[#50C878]/10 hover:text-[#50C878] hover:border-[#50C878]/30",
    },
    {
      id: "whatsapp",
      icon: <Phone className="size-4" />,
      label: "WhatsApp",
      href: "https://wa.me/6281234567890",
      color: "hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-[99] flex flex-col items-end gap-3"
        >
          {/* ── Sub-menu items ────────────────────────────────────── */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex flex-col gap-2 items-end"
              >
                {contacts.map((item, idx) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.06, type: "spring", stiffness: 300, damping: 25 }}
                    className={`flex items-center gap-3 rounded-full border border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 shadow-lg dark:shadow-2xl transition-all duration-300 whitespace-nowrap ${item.color}`}
                  >
                    {item.icon}
                    {item.label}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Main Button ───────────────────────────────────────── */}
          <motion.button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Hubungi Kami"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            className={`relative flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold uppercase tracking-wider shadow-[0_8px_32px_rgba(80,200,120,0.35)] transition-all duration-300 overflow-hidden
              ${
                isOpen
                  ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900"
                  : "bg-[#50C878] text-zinc-950 hover:bg-[#50C878]/90 hover:shadow-[0_8px_40px_rgba(80,200,120,0.55)]"
              }`}
          >
            {/* Shimmer */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />

            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative z-10"
            >
              {isOpen ? <X className="size-4" /> : <MessageCircle className="size-4" />}
            </motion.span>
            <span className="relative z-10">Hubungi Kami</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
