"use client";

import type { ReactTable, RowData } from "@tanstack/react-table";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { DataTableFeatures } from "@/shared/ui/data-table-features";

const ARIA_SORT = { asc: "ascending", desc: "descending" } as const;

type DataTableProps<TData extends RowData> = {
  table: ReactTable<DataTableFeatures, TData>;
  /** Read by screen readers only. */
  caption: string;
  /** Another page, size or sort is loading; the rows shown are the previous ones. */
  isUpdating?: boolean;
};

/** Renders a TanStack table instance with shadcn's Table: headers, rows, and nothing else (no state, no fetching). */
export function DataTable<TData extends RowData>({ table, caption, isUpdating = false }: DataTableProps<TData>) {
  return (
    // The table scrolls sideways inside this card on narrow screens; the page itself never does.
    <div aria-busy={isUpdating} className={cn("rounded-xl border bg-card transition-opacity", isUpdating && "opacity-60")}>
      <Table>
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                return (
                  <TableHead
                    key={header.id}
                    className="px-4"
                    aria-sort={header.column.getCanSort() ? (sorted ? ARIA_SORT[sorted] : "none") : undefined}
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id} className="px-4">
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
