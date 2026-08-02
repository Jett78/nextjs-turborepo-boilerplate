import { PaymentSettingsForm } from "@/components/dashboard/payment-settings-form";
import DashboardHeading from "@/components/dashboard/dashboard-heading";

export const metadata = {
  title: "Payment Settings | Dashboard",
};

export default function PaymentSettingsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeading
        title="Payment Settings"
        description="Manage your payment gateway credentials and configuration"
      />
      <PaymentSettingsForm />
    </div>
  );
}
