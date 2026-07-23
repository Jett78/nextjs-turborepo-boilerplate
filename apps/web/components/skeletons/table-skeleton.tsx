"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
      <Table>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-slate-200 rounded-full animate-pulse" />
                  <div className="h-6 w-6 bg-slate-200 rounded-full animate-pulse" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSkeleton;
