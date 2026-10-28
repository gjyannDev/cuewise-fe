import type { ReactNode } from "react";

type InterviewDetailListProps = {
  items: { label: string; value: ReactNode }[];
};

/** Label/value rows for the side panels (setup summary and interview details). */
export function InterviewDetailList({ items }: InterviewDetailListProps) {
  return (
    <dl className="grid gap-3 text-sm">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd className="text-right font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
