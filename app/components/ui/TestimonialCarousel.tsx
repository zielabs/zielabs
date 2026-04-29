"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";
import TiltCard from "@/app/components/ui/TiltCard";
import { getInitials } from "@/app/lib/utils";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatarUrl?: string | null;
}

export default function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Jika jumlah testimoni sedikit, kita gandakan agar efek infinite marquee berjalan mulus
  const displayItems =
    testimonials.length > 0
      ? [...testimonials, ...testimonials, ...testimonials]
      : [];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    let scrollPos = 0;
    
    // Kecepatan scroll (pixels per frame)
    const speed = 1.5;

    const scroll = () => {
      if (!isPausedRef.current) {
        scrollPos += speed;
        // Reset scroll position ketika sudah mencapai sepertiga konten (karena ada 3 copy)
        if (scrollPos >= el.scrollWidth / 3) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [displayItems.length]);

  if (testimonials.length === 0) return null;

  return (
    <div className="relative overflow-hidden w-full py-10">
      {/* Gradient edges for fading effect */}
      <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
      
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-hidden whitespace-nowrap px-4 py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {displayItems.map((t, idx) => (
          <div
            key={`${t.id}-${idx}`}
            className="w-[350px] md:w-[450px] shrink-0 whitespace-normal"
          >
            <TiltCard>
              <div className="group relative h-full rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-950/60 p-8 glass-card transition-all duration-500 hover:border-[#50C878]/30 shadow-sm dark:shadow-none flex flex-col">
                <div className="absolute -inset-px bg-gradient-to-br from-[#50C878]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                <div className="relative mb-6">
                  <Quote className="size-8 text-[#50C878]/20 group-hover:text-[#50C878]/50 transition-colors duration-500" />
                </div>
                <p className="relative mb-8 text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors flex-grow">
                  &ldquo;{t.content}&rdquo;
                </p>

                <div className="mt-auto">
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
                  <div className="relative flex items-center gap-4 pt-6 border-t border-zinc-100 dark:border-white/5">
                    <div className="size-12 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 flex items-center justify-center text-sm font-bold text-[#50C878] flex-shrink-0 group-hover:border-[#50C878]/50 transition-colors">
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
                        {t.role}, <span className="text-zinc-500 dark:text-zinc-400">{t.company}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>
    </div>
  );
}
