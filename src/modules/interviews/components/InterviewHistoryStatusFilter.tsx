import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { HISTORY_STATUS_ALL, HISTORY_STATUS_OPTIONS } from "../constants";
import { historyStatusParamSchema } from "../schemas/interviews.schema";
import type { SessionStatus } from "../types/interviews.types";

const TRIGGER_ID = "history-status-filter";

type InterviewHistoryStatusFilterProps = {
  /** The filter in the URL; none means every status. */
  value?: SessionStatus;
  onChange: (status: SessionStatus | undefined) => void;
};

export function InterviewHistoryStatusFilter({ value, onChange }: InterviewHistoryStatusFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={TRIGGER_ID}>Status</Label>
      <Select
        value={value ?? HISTORY_STATUS_ALL}
        // "all" (or anything that isn't a status) clears the filter.
        onValueChange={(next) => onChange(historyStatusParamSchema.safeParse(next).data)}
      >
        <SelectTrigger id={TRIGGER_ID} className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {HISTORY_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
