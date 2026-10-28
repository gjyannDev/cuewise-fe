import {
  BarChart3,
  FileQuestion,
  History,
  LayoutDashboard,
  MessagesSquare,
  Settings,
  Users,
} from "lucide-react";

import type { Role } from "@/modules/auth/types/auth.types";
import type { SidebarConfig } from "@/shared/sidebar/types/sidebar.types";

/**
 * Sidebar contents per role. Edit these lists to add, remove, rename, reorder or re-icon items;
 * each section is rendered as its own group under its `label` header.
 */
const APP_NAME = "Cuewise";

const USER_SIDEBAR: SidebarConfig = {
  brand: { name: APP_NAME, href: "/" },
  sections: [
    {
      key: "main",
      label: "Menu",
      items: [
        { key: "dashboard", title: "Dashboard", href: "/", icon: LayoutDashboard },
        { key: "interviews", title: "AI Mock Interview", href: "/interviews", icon: MessagesSquare },
        { key: "history", title: "History", href: "/history", icon: History },
        { key: "progress", title: "Progress", href: "/progress", icon: BarChart3 },
      ],
    },
    {
      key: "secondary",
      label: "Account",
      items: [{ key: "settings", title: "Settings", href: "/settings", icon: Settings }],
    },
  ],
};

const ADMIN_SIDEBAR: SidebarConfig = {
  brand: { name: APP_NAME, href: "/admin" },
  sections: [
    {
      key: "main",
      label: "Menu",
      items: [
        { key: "dashboard", title: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
        { key: "users", title: "Users", href: "/admin/users", icon: Users },
        { key: "questions", title: "Questions", href: "/admin/questions", icon: FileQuestion },
      ],
    },
    {
      key: "secondary",
      label: "Account",
      items: [{ key: "settings", title: "Settings", href: "/admin/settings", icon: Settings }],
    },
  ],
};

export const SIDEBAR_BY_ROLE: Record<Role, SidebarConfig> = {
  user: USER_SIDEBAR,
  admin: ADMIN_SIDEBAR,
};

export const ROLE_LABELS: Record<Role, string> = {
  user: "User",
  admin: "Admin",
};
