import type { LucideIcon } from "lucide-react";

export type NavItem = {
  key: string;
  title: string;
  href: string;
  icon: LucideIcon;
  /** Only active on exactly this path, not on nested pages (for landing pages like `/admin`). */
  exact?: boolean;
};

/** A visually separated group of items (e.g. main, secondary). */
export type NavSection = {
  key: string;
  items: NavItem[];
};

export type SidebarConfig = {
  brand: { name: string; href: string };
  sections: NavSection[];
};

export type SidebarUser = {
  email: string;
  /** Display label for the role, e.g. "Admin". */
  roleLabel: string;
};
