// app/lib/mock-data.ts

import type {
  CategoryDisplay,
  ProductDisplay,
  ServiceDisplay,
  TestimonialDisplay,
} from "@/app/lib/types";

// ─── Categories ────────────────────────────────────────────────────

export const MOCK_CATEGORIES: CategoryDisplay[] = [
  { id: 1, name: "Enterprise System", slug: "enterprise-system" },
  { id: 2, name: "Web App", slug: "web-app" },
  { id: 3, name: "POS System", slug: "pos-system" },
  { id: 4, name: "Mobile App", slug: "mobile-app" },
  { id: 5, name: "SaaS", slug: "saas" },
  { id: 6, name: "Desktop App", slug: "desktop-app" },
];

// ─── Products ──────────────────────────────────────────────────────

export const MOCK_PRODUCTS: ProductDisplay[] = [
  {
    id: 1,
    title: "E-Borrow",
    slug: "e-borrow",
    description:
      "Sistem inventarisasi enterprise berbasis VILT Stack (Vue.js, Inertia.js, Laravel, Tailwind CSS). Dilengkapi dengan Role-based Access Control (RBAC), audit trail lengkap, dashboard analitik real-time, dan modul peminjaman aset multi-departemen. Dibangun untuk skalabilitas korporat dengan arsitektur modular.",
    techStack: "VILT Stack",
    imageUrl: null,
    liveUrl: null,
    category: { id: 1, name: "Enterprise System", slug: "enterprise-system" },
  },
  {
    id: 2,
    title: "Commerce Studio",
    slug: "commerce-studio",
    description:
      "Platform e-commerce headless dengan CMS terintegrasi, sistem pembayaran multi-gateway, dan dashboard analitik berbasis AI untuk keputusan bisnis yang lebih cepat. Arsitektur microservices memungkinkan skalabilitas horizontal tanpa batas.",
    techStack: "Next.js, Prisma, Stripe",
    imageUrl: null,
    liveUrl: "https://zielabs.com",
    category: { id: 2, name: "Web App", slug: "web-app" },
  },
  {
    id: 3,
    title: "POS Nexus",
    slug: "pos-nexus",
    description:
      "Sistem Point of Sale lintas platform untuk ritel modern. Offline-first architecture, sinkronisasi cloud otomatis, integrasi printer thermal, dan laporan penjualan harian yang komprehensif dengan export ke Excel dan PDF.",
    techStack: "Electron, React, SQLite",
    imageUrl: null,
    liveUrl: null,
    category: { id: 3, name: "POS System", slug: "pos-system" },
  },
  {
    id: 4,
    title: "ZieHR Mobile",
    slug: "ziehr-mobile",
    description:
      "Aplikasi mobile HR untuk manajemen absensi berbasis GPS, pengajuan cuti, slip gaji digital, dan komunikasi tim — semua dalam satu antarmuka yang intuitif. Push notification real-time untuk approval workflow.",
    techStack: "Flutter, Firebase, Node.js",
    imageUrl: null,
    liveUrl: null,
    category: { id: 4, name: "Mobile App", slug: "mobile-app" },
  },
  {
    id: 5,
    title: "SaaS Analytics Hub",
    slug: "saas-analytics-hub",
    description:
      "Dashboard SaaS untuk agregasi data dari berbagai sumber, visualisasi interaktif dengan chart library kustom, dan laporan otomatis yang dikirim via email atau Slack. Multi-tenant architecture dengan isolasi data ketat.",
    techStack: "React, D3.js, PostgreSQL",
    imageUrl: null,
    liveUrl: "https://zielabs.com",
    category: { id: 5, name: "SaaS", slug: "saas" },
  },
  {
    id: 6,
    title: "Desktop Vault",
    slug: "desktop-vault",
    description:
      "Aplikasi desktop manajemen aset digital perusahaan. Enkripsi data end-to-end AES-256, backup otomatis ke cloud storage, dan audit trail lengkap untuk compliance regulasi. Mendukung Windows, macOS, dan Linux.",
    techStack: "Electron, React, SQLCipher",
    imageUrl: null,
    liveUrl: null,
    category: { id: 6, name: "Desktop App", slug: "desktop-app" },
  },
];

// ─── Services ──────────────────────────────────────────────────────

export const MOCK_SERVICES: ServiceDisplay[] = [
  {
    id: 1,
    title: "Web Application Development",
    slug: "web-application-development",
    description:
      "Membangun aplikasi web enterprise-grade dengan teknologi modern. Dari landing page hingga platform SaaS kompleks, kami mengutamakan performa, keamanan, dan pengalaman pengguna yang premium.",
    icon: "Globe",
  },
  {
    id: 2,
    title: "Mobile App Development",
    slug: "mobile-app-development",
    description:
      "Pengembangan aplikasi mobile cross-platform dengan Flutter dan React Native. UI/UX presisi, integrasi API seamless, dan optimasi performa untuk pengalaman native di iOS dan Android.",
    icon: "Smartphone",
  },
  {
    id: 3,
    title: "POS & Retail Solutions",
    slug: "pos-retail-solutions",
    description:
      "Solusi Point of Sale kustom untuk bisnis ritel modern. Offline-first, sinkronisasi real-time, integrasi hardware, dan dashboard analitik penjualan yang komprehensif.",
    icon: "ShoppingCart",
  },
  {
    id: 4,
    title: "SaaS Product Engineering",
    slug: "saas-product-engineering",
    description:
      "Rekayasa produk SaaS dari konsep hingga peluncuran. Multi-tenant architecture, subscription billing, role-based access, dan skalabilitas horizontal untuk pertumbuhan bisnis tanpa batas.",
    icon: "Cloud",
  },
  {
    id: 5,
    title: "Desktop Application",
    slug: "desktop-application",
    description:
      "Pengembangan aplikasi desktop cross-platform dengan Electron dan Tauri. Performa native, akses filesystem, integrasi hardware, dan distribusi otomatis via auto-updater.",
    icon: "Monitor",
  },
  {
    id: 6,
    title: "Enterprise System Integration",
    slug: "enterprise-system-integration",
    description:
      "Integrasi sistem enterprise end-to-end: ERP, CRM, HRIS, dan supply chain management. API gateway, message queue, dan arsitektur event-driven untuk ekosistem teknologi yang terpadu.",
    icon: "Network",
  },
];

// ─── Testimonials ──────────────────────────────────────────────────

export const MOCK_TESTIMONIALS: TestimonialDisplay[] = [
  {
    id: 1,
    name: "Andi Prasetyo",
    role: "CTO",
    company: "PT Mitra Digital Nusantara",
    content:
      "Zielabs berhasil membangun sistem inventarisasi enterprise kami dari nol. Kualitas kode sangat tinggi, dokumentasi lengkap, dan tim mereka sangat responsif. ROI terlihat dalam 3 bulan pertama setelah deployment.",
    avatarUrl: null,
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Wijaya",
    role: "CEO",
    company: "Tokoku Digital",
    content:
      "Platform e-commerce yang dibangun Zielabs meningkatkan conversion rate kami sebesar 40%. Arsitektur yang scalable membuat kami tidak perlu khawatir saat traffic melonjak di event besar.",
    avatarUrl: null,
    rating: 5,
  },
  {
    id: 3,
    name: "Budi Hartono",
    role: "Operations Director",
    company: "RetailMax Indonesia",
    content:
      "Sistem POS dari Zielabs mengubah cara kami berbisnis. Fitur offline-first sangat krusial untuk cabang di daerah dengan koneksi internet terbatas. Laporan penjualan real-time sangat membantu pengambilan keputusan.",
    avatarUrl: null,
    rating: 5,
  },
  {
    id: 4,
    name: "Diana Kusuma",
    role: "VP of Engineering",
    company: "CloudTech Solutions",
    content:
      "Tim Zielabs memiliki pemahaman mendalam tentang arsitektur SaaS. Mereka membangun platform analytics kami dengan multi-tenant architecture yang solid. Tidak ada downtime sejak launch.",
    avatarUrl: null,
    rating: 4,
  },
  {
    id: 5,
    name: "Rizky Fauzan",
    role: "HR Director",
    company: "PT Global Manpower",
    content:
      "Aplikasi mobile HR dari Zielabs membuat proses absensi dan cuti menjadi seamless. Karyawan kami sangat menyukai UX-nya yang intuitif. Adopsi mencapai 95% dalam bulan pertama.",
    avatarUrl: null,
    rating: 5,
  },
  {
    id: 6,
    name: "Lisa Anggraini",
    role: "IT Manager",
    company: "SecureVault Corp",
    content:
      "Desktop app untuk manajemen dokumen sensitif yang dibangun Zielabs memenuhi semua requirement compliance kami. Enkripsi end-to-end dan audit trail sangat robust.",
    avatarUrl: null,
    rating: 4,
  },
];
