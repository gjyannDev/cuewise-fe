import { MessageCircleIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type InterviewerAvatarProps = {
  /** `sm` beside transcript lines; `default` plus a `className` size for the room's stage. */
  size?: ComponentProps<typeof Avatar>["size"];
  className?: string;
};

/** The interviewer's mark next to its transcript lines and on the room's stage. Decorative: the text says who speaks. */
export function InterviewerAvatar({ size = "sm", className }: InterviewerAvatarProps) {
  return (
    <Avatar aria-hidden size={size} className={cn("shrink-0", className)}>
      <AvatarFallback className="bg-accent">
        <MessageCircleIcon className="size-4 text-primary-text" />
      </AvatarFallback>
    </Avatar>
  );
}
