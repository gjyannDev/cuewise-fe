import { MessageCircleIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/** The interviewer's mark next to its messages and the thinking indicator. Decorative: the text says who speaks. */
export function InterviewerAvatar() {
  return (
    <Avatar aria-hidden size="sm" className="shrink-0">
      <AvatarFallback className="bg-accent">
        <MessageCircleIcon className="size-4 text-primary-text" />
      </AvatarFallback>
    </Avatar>
  );
}
