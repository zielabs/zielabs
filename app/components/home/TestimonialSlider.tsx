// app/components/home/TestimonialSlider.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Auto-sliding testimonial carousel dengan animasi slide horizontal.
// Mendukung pause on hover dan dot navigation.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { getInitials } from "@/app/lib/utils";

interface Testimonial {
  id: string | number;
  content: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  avatarUrl?: string | null;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

const SLIDE_INTERVAL = 4500; // ms

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = testimonials.length;

  const goTo = useCallback(
    (index: number, dir: 1 | -1 = 1) => {
      setDirection(dir);
      setCurrent((index + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    intervalRef.current = setInterval(goNext, SLIDE_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext, isPaused, total]);

  if (total === 0) return null;

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "80%" : "-80%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-80%" : "80%",
      opacity: 0,
    }),
  };

  const t = testimonials[current];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Slide Area ──────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl min-h-[300px] md:min-h-[260px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={t.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 260, damping: 30 },
              opacity: { duration: 0.25 },
            }}
            className="group relative h-full rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-950/60 p-8 md:p-10 glass-card shadow-sm dark:shadow-none"
          >
            {/* Hover glow */}
            <div className="absolute -inset-px bg-gradient-to-br from-[#50C878]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

            {/* Quote icon */}
            <div className="relative mb-6">
              <Quote className="size-10 text-[#50C878]/30" />
            </div>

            {/* Content */}
            <p className="relative mb-8 text-base md:text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              &ldquo;{t.content}&rdquo;
            </p>

            {/* Stars */}
            <div className="relative mb-6 flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${
                    i < t.rating
                      ? "fill-[#50C878] text-[#50C878]"
                      : "fill-zinc-200 dark:fill-zinc-800 text-zinc-200 dark:text-zinc-800"
                  }`}
                />
              ))}
            </div>

            {/* Author */}
            <div className="relative flex items-center gap-4 pt-6 border-t border-zinc-100 dark:border-white/5">
              <div className="size-14 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 flex items-center justify-center text-sm font-bold text-[#50C878] flex-shrink-0">
                {t.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatarUrl} alt={t.name} className="size-full object-cover" />
                ) : (
                  getInitials(t.name)
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.name}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-wider">
                  {t.role},{" "}
                  <span className="text-zinc-500 dark:text-zinc-400">{t.company}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Controls ────────────────────────────────────────────────────── */}
      <div className="mt-8 flex items-center justify-between">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-[#50C878]"
                  : "w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>

        {/* Arrow Buttons */}
        {total > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="flex size-10 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-all hover:border-[#50C878]/50 hover:text-[#50C878] hover:shadow-[0_0_15px_rgba(80,200,120,0.2)]"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next testimonial"
              className="flex size-10 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-all hover:border-[#50C878]/50 hover:text-[#50C878] hover:shadow-[0_0_15px_rgba(80,200,120,0.2)]"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {!isPaused && total > 1 && (
        <div className="mt-4 h-[2px] w-full rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <motion.div
            key={current}
            className="h-full bg-[#50C878]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: SLIDE_INTERVAL / 1000, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
}
