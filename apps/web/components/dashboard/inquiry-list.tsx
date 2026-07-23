"use client";

import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteInquiryButton } from "./delete-inquiry-button";
import type { Inquiry } from "@/types/inquiry";

export function InquiryList() {
  const { getAll } = useCrud<Inquiry>({
    endpoint: API_ROUTES.INQUIRY,
    queryKey: "inquiries",
    isAuthenticated: true,
  });

  const { data, isLoading, isError } = getAll({ take: 50 });

  if (isLoading) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Loading inquiries...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border p-8 text-center text-destructive">
        Failed to load inquiries. Please try again.
      </div>
    );
  }

  const inquiries = data || [];

  if (inquiries.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        No inquiries found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.map((inquiry: any) => (
            <TableRow key={inquiry.id}>
              <TableCell className="font-medium">{inquiry.name}</TableCell>
              <TableCell className="text-muted-foreground">{inquiry.email}</TableCell>
              <TableCell className="text-muted-foreground">{inquiry.phone || "-"}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {inquiry.message}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DeleteInquiryButton id={inquiry.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
