"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const recentOrders = [
  {
    id: 1,
    customer: { name: "John Smith", email: "john@example.com" },
    type: "document",
    amount: 2500,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: 2,
    customer: { name: "Sarah Johnson", email: "sarah@example.com" },
    type: "pricing",
    amount: 4999,
    date: "2024-01-14",
    status: "pending",
  },
  {
    id: 3,
    customer: { name: "Mike Williams", email: "mike@example.com" },
    type: "document",
    amount: 1500,
    date: "2024-01-13",
    status: "completed",
  },
  {
    id: 4,
    customer: { name: "Emily Brown", email: "emily@example.com" },
    type: "pricing",
    amount: 9999,
    date: "2024-01-12",
    status: "completed",
  },
  {
    id: 5,
    customer: { name: "David Lee", email: "david@example.com" },
    type: "document",
    amount: 3000,
    date: "2024-01-11",
    status: "failed",
  },
];

const getStatusBadge = (status: string) => {
  const statusStyles: Record<string, string> = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    failed: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return statusStyles[status] || "bg-slate-50 text-slate-700 border-slate-200";
};

export function ActivityTable() {
  return (
    <div className="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Recent Orders</h3>
          <p className="text-xs text-slate-500 mt-1">
            Latest customer orders and transactions.
          </p>
        </div>
        <Link
          href="/dashboard/inquiries"
          className="text-xs font-medium text-primary hover:underline shrink-0"
        >
          View all
        </Link>
      </div>

      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="px-6 py-3 font-bold text-slate-900 uppercase text-[11px] tracking-wider">
              Customer
            </TableHead>
            <TableHead className="px-6 py-3 font-bold text-slate-900 uppercase text-[11px] tracking-wider">
              Order Type
            </TableHead>
            <TableHead className="px-6 py-3 font-bold text-slate-900 uppercase text-[11px] tracking-wider">
              Amount
            </TableHead>
            <TableHead className="px-6 py-3 font-bold text-slate-900 uppercase text-[11px] tracking-wider">
              Date
            </TableHead>
            <TableHead className="px-6 py-3 font-bold text-slate-900 uppercase text-[11px] tracking-wider text-right">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow
              key={order.id}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900 leading-none">
                    {order.customer.name}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 font-medium">
                    {order.customer.email}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-md border w-fit ${
                    order.type === "document"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-indigo-50 text-indigo-700 border-indigo-200"
                  }`}
                >
                  {order.type === "document" ? "Document" : "Pricing Plan"}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="text-sm font-black text-slate-900">
                  Rs. {order.amount.toLocaleString()}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="text-xs font-medium text-slate-700">
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
