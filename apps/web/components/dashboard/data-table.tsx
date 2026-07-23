"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/skeletons/table-skeleton";
import NoData from "@/components/no-data";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  skeletonRows?: number;
  className?: string;
}

export default function DataTable<T>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 7,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return <TableSkeleton rows={skeletonRows} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12">
        <NoData title="Records" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden",
        className
      )}
    >
      <Table>
        <TableHeader className="bg-slate-100/50">
          <TableRow className="hover:bg-transparent border-b border-slate-100">
            {columns.map((col, index) => (
              <TableHead
                key={String(col.key) + index}
                className={cn(
                  "px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-600",
                  col.className
                )}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors duration-200"
            >
              {columns.map((col, colIndex) => (
                <TableCell
                  key={String(col.key) + colIndex}
                  className={cn(
                    "px-6 py-4 text-xs text-slate-600",
                    col.className
                  )}
                >
                  {col.render
                    ? col.render(row, rowIndex)
                    : String((row as Record<string, unknown>)[col.key] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
