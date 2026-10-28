import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import type { SidebarUser } from "./types/sidebar.types";
import { getInitials } from "./utils/get-initials";

type SidebarUserCardProps = {
  user: SidebarUser;
};

export function SidebarUserCard({ user }: SidebarUserCardProps) {
  return (
    <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:p-0">
      <Avatar className="size-8">
        <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
      </Avatar>
      <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
        <span className="truncate font-medium" title={user.email}>
          {user.email}
        </span>
        <span className="truncate text-xs text-sidebar-default">{user.roleLabel}</span>
      </div>
    </div>
  );
}
