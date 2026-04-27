# Zielabs UI/UX Design System

## 1. Core Philosophy
- **Style:** Minimalist Luxury & Digital Cyberpunk.
- **Vibe:** High-tech, expensive, precise, and clean.
- **Rule:** Never use overly bright or playful colors. Maintain a serious, enterprise-level aesthetic.

## 2. Color Palette
Always use Tailwind arbitrary values or configure these in `tailwind.config.ts`.
- **Background (Primary):** Obsidian Black `bg-[#050505]` or `bg-zinc-950`.
- **Text (Primary):** Silver White `text-[#F5F5F5]` or `text-zinc-100`.
- **Text (Muted):** `text-zinc-400`.
- **Accent/Brand Color:** Emerald Green `text-[#50C878]`, `bg-[#50C878]`.
- **Subtle Accent/Glow:** Forest Green `bg-[#013220]`, Neon Mint `text-[#A7FFD3]`.

## 3. Typography
- **Headings & Body:** `Plus Jakarta Sans` or `Inter` (Sans-serif).
- **Style:** Wide letter-spacing for headings to convey luxury.

## 4. UI Components & Effects
- **Cards & Containers:** Use "Bento Grid" layout style. Rounded corners (`rounded-2xl` or `rounded-xl`).
- **Glassmorphism:** Use `backdrop-blur-md` and `bg-white/5` for floating elements (navbars, cards).
- **Borders:** Extremely thin and subtle. Use `border border-white/10` or a very subtle green `border-[#50C878]/20`.
- **Interactions:** Subtle hover effects. Elements should slightly scale up (`hover:scale-[1.02]`) or glow on hover.

## 5. 3D Elements
- The Hero section and key feature sections should integrate `@react-three/fiber` canvases rendering abstract, high-tech geometric shapes with dark materials and green lighting.   