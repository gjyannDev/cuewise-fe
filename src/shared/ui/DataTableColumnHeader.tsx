"use client";

import type { CellData, Column, RowData } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "@/shared/ui/data-table-features";

type DataTableColumnHeaderProps<TData extends RowData, TValue extends CellData> = {
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
};

/**
 * A column header that sorts on click (ascending, then descending; one column at a time). A column that can't sort
 * shows its title only. The direction is announced through `aria-sort` on the header cell (DataTable).
 */
export function DataTableColumnHeader<TData extends RowData, TValue extends CellData>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return title;
  }
  const sorted = column.getIsSorted();
  const Icon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ChevronsUpDownIcon;

  return (
    <Button variant="ghost" size="sm" className="-ml-2.5" onClick={column.getToggleSortingHandler()}>
      {title}
      <Icon aria-hidden data-icon="inline-end" className={sorted ? undefined : "text-muted-foreground"} />
    </Button>
  );
}
