import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SetupSectionCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Shown beside the title, e.g. an "Optional" badge. */
  badge?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** One category of the setup form, as its own card in the setup grid. */
export function SetupSectionCard({ icon: Icon, title, description, badge, className, children }: SetupSectionCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent">
          <Icon aria-hidden className="size-5 text-primary-text" />
        </span>
        <div className="flex flex-col gap-1">
          <CardTitle className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">{title}</h3>
            {badge}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">{children}</CardContent>
    </Card>
  );
}
