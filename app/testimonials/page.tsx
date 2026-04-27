// app/testimonials/page.tsx

import type { Metadata } from "next";
import { Star, Quote } from "lucide-react";
import { getTestimonials } from "@/app/actions/testimonial.actions";
import { getInitials } from "@/app/lib/utils";
import TextReveal from "@/app/components/ui/TextReveal";
import TiltCard from "@/app/components/ui/TiltCard";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Apa kata klien tentang produk digital yang kami bangun.",
};

export default async function TestimonialsPage() {
  const result = await getTestimonials();
  const testimonials = result.data ?? [];

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-32 noise-bg relative overflow-hidden">
      <div className="scanlines" />
      <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-40 h-[600px] w-[800px] rounded-[100%] bg-[#D4A843]/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 mb-20 relative z-10 text-center">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-[#50C878]">
          Client Testimonials
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 md:text-6xl lg:text-7xl flex flex-col items-center gap-2">
          <TextReveal delay={0.1}>Apa Kata</TextReveal>
          <TextReveal delay={0.2}><span className="text-zinc-600">Klien Kami</span></TextReveal>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-zinc-400">
          Kepercayaan adalah mata uang yang paling berharga. Lihat bagaimana
          kami membantu berbagai bisnis mencapai tujuan mereka melalui produk
          digital yang inovatif.
        </p>
        <div className="mt-8 mx-auto h-[2px] w-32 bg-gradient-to-r from-transparent via-[#50C878] to-transparent" />
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        {testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 rounded-3xl glass-card mt-12">
            <span className="text-6xl select-none opacity-20 mb-6 drop-shadow-[0_0_15px_rgba(80,200,120,0.3)] text-[#50C878]">⬡</span>
            <h3 className="text-xl font-bold text-zinc-200 mb-2 uppercase tracking-widest">No Feedback Yet</h3>
            <p className="text-zinc-500 text-sm">Belum ada testimoni klien yang ditambahkan ke database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TiltCard key={t.id}>
                <div className="group relative h-full rounded-3xl border border-white/5 bg-zinc-950/60 p-10 glass-card transition-all duration-500 hover:border-[#50C878]/30">
                  <div className="absolute -inset-px bg-gradient-to-br from-[#50C878]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                  
                  <div className="relative mb-8">
                    <Quote className="size-12 text-[#50C878]/20 group-hover:text-[#50C878]/50 transition-colors duration-500" />
                  </div>
                  <p className="relative mb-10 text-lg leading-relaxed text-zinc-300 group-hover:text-zinc-100 transition-colors">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  
                  <div className="mt-auto">
                    <div className="relative mb-6 flex gap-1.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`size-5 ${
                            i < t.rating
                              ? "fill-[#50C878] text-[#50C878] drop-shadow-[0_0_8px_rgba(80,200,120,0.4)]"
                              : "fill-zinc-800 text-zinc-800"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="relative flex items-center gap-5 pt-6 border-t border-white/5">
                      <div className="size-14 overflow-hidden rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-sm font-bold text-[#50C878] flex-shrink-0 group-hover:border-[#50C878]/50 transition-colors">
                        {t.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.avatarUrl} alt={t.name} className="size-full object-cover" />
                        ) : (
                          getInitials(t.name)
                        )}
                      </div>
                      <div>
                        <p className="text-base font-bold text-zinc-100">{t.name}</p>
                        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">
                          {t.role}, <span className="text-zinc-400">{t.company}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
