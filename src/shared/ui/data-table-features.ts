import { rowPaginationFeature, rowSortingFeature, tableFeatures } from "@tanstack/react-table";

/**
 * What every shared data table registers: pagination and sorting, both owned by the server (`manualPagination`,
 * `manualSorting`), so no client row models. Module scope: TanStack Table rebuilds its models when this changes.
 */
export const dataTableFeatures = tableFeatures({ rowPaginationFeature, rowSortingFeature });

export type DataTableFeatures = typeof dataTableFeatures;
