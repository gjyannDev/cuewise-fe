"use client";

import type { ReactTable, RowData } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { type ReactNode, useId } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DataTableFeatures } from "@/shared/ui/data-table-features";

type DataTablePaginationProps<TData extends RowData> = {
  table: ReactTable<DataTableFeatures, TData>;
  pageSizes: readonly number[];
  /** Shown on the left, e.g. the total count. */
  summary?: ReactNode;
};

/**
 * shadcn's data-table pager over a TanStack table instance: the summary on the left; rows per page, "Page X of Y" and
 * first / previous / next / last on the right. Every value and action comes from the table's pagination API.
 */
export function DataTablePagination<TData extends RowData>({
  table,
  pageSizes,
  summary,
}: DataTablePaginationProps<TData>) {
  const sizeId = useId();
  const { pageIndex, pageSize } = table.state.pagination;
  const canPrevious = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();
  const controls = [
    { label: "Go to first page", icon: ChevronsLeftIcon, onClick: () => table.firstPage(), disabled: !canPrevious },
    { label: "Go to previous page", icon: ChevronLeftIcon, onClick: () => table.previousPage(), disabled: !canPrevious },
    { label: "Go to next page", icon: ChevronRightIcon, onClick: () => table.nextPage(), disabled: !canNext },
    { label: "Go to last page", icon: ChevronsRightIcon, onClick: () => table.lastPage(), disabled: !canNext },
  ];

  return (
    <nav aria-label="Table pages" className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">{summary}</p>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor={sizeId}>Rows per page</Label>
          <Select value={String(pageSize)} onValueChange={(value) => table.setPageSize(Number(value))}>
            <SelectTrigger id={sizeId} size="sm" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pageSizes.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <p aria-live="polite" className="text-sm font-medium">
          Page {pageIndex + 1} of {Math.max(1, table.getPageCount())}
        </p>
        <div className="flex items-center gap-2">
          {controls.map(({ label, icon: Icon, onClick, disabled }) => (
            <Button key={label} variant="outline" size="icon-sm" aria-label={label} disabled={disabled} onClick={onClick}>
              <Icon aria-hidden />
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
