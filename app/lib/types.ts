// app/lib/types.ts

// ─── Database Model Types ──────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  techStack: string;
  imageUrl: string | null;
  liveUrl: string | null;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl: string | null;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Server Action Response ────────────────────────────────────────

export interface ActionResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

// ─── Frontend-only display types (tanpa timestamp) ─────────────────

export interface CategoryDisplay {
  id: number;
  name: string;
  slug: string;
}

export interface ProductDisplay {
  id: number;
  title: string;
  slug: string;
  description: string;
  techStack: string;
  imageUrl: string | null;
  liveUrl: string | null;
  category: CategoryDisplay;
}

export interface ServiceDisplay {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
}

export interface TestimonialDisplay {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl: string | null;
  rating: number;
}
