import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

type InterviewMessageCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  /** "alert" for failures so screen readers announce them. */
  role?: "alert";
};

/** Centered icon, title, text and one action: used for the not-found, error and feedback placeholders. */
export function InterviewMessageCard({ icon: Icon, title, description, action, role }: InterviewMessageCardProps) {
  return (
    <Card role={role}>
      <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent">
          <Icon aria-hidden className="size-6 text-primary-text" />
        </span>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        {action && <div className="mt-2">{action}</div>}
      </CardContent>
    </Card>
  );
}
