import { InquiryList } from "@/components/dashboard/inquiry-list";

export default function InquiriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inquiries</h1>
        <p className="text-muted-foreground">Manage contact form submissions</p>
      </div>
      <InquiryList />
    </div>
  );
}
