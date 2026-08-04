"use client";

import { useState} from "react";
import {
  Globe,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Server,
  Shield,
  ArrowRight,
  Check,
  Zap,
} from "lucide-react";
import DashboardHeading from "@/components/dashboard/dashboard-heading";
import PrimaryButton from "@/components/ui/primary-button";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import { showSuccess, showError } from "@/lib/toast-helper";
import { API_ROUTES } from "@/config/api-routes";
import { useCrud } from "@/hooks/useCRUD";
import { apiClient } from "@/lib/api-client";

interface Domain {
  id: string;
  domain: string;
  status: string;
  verifiedAt: string | null;
  sslStatus: string;
  errorMessage: string | null;
  createdAt: string;
}

export default function DomainsPage() {
  const [domain, setDomain] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const { getAll, create } = useCrud<Domain>({
    endpoint: API_ROUTES.DOMAIN,
    queryKey: "domains",
    isAuthenticated: true,
  });

  const { data: domains, isLoading } = getAll();
  const savedDomain = domains?.[0] || null;

  const handleSave = async () => {
    if (!domain) {
      showError("Please enter a domain");
      return;
    }

    create.mutate(
      { domain } as any,
      {
        onSuccess: (res: any) => {
          if (res.success) {
            showSuccess("Domain saved successfully");
            setDomain("");
          }
        },
        onError: (err: any) => {
          showError(err.message || "Failed to save domain");
        },
      }
    );
  };

  const handleVerify = async () => {
    if (!savedDomain) return;
    setVerifying(true);

    try {
      const data = await apiClient<any>(`${API_ROUTES.DOMAIN}/${savedDomain.id}/verify`, {
        method: "POST",
        isAuthenticated: true,
      });
      if (data.success) {
        showSuccess("Domain verification completed");
        getAll();
      } else {
        showError(data.message || "Verification failed");
      }
    } catch (err: any) {
      showError(err.message || "Failed to verify domain");
    }
    setVerifying(false);
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; icon: any; text: string; description: string }> = {
      pending: {
        color: "text-amber-700",
        bg: "bg-amber-50 border-amber-200",
        icon: AlertCircle,
        text: "Pending",
        description: "Waiting for DNS verification",
      },
      verifying: {
        color: "text-blue-700",
        bg: "bg-blue-50 border-blue-200",
        icon: Loader2,
        text: "Verifying",
        description: "Checking DNS records...",
      },
      verified: {
        color: "text-emerald-700",
        bg: "bg-emerald-50 border-emerald-200",
        icon: CheckCircle,
        text: "Verified",
        description: "DNS verified, deploying...",
      },
      active: {
        color: "text-emerald-700",
        bg: "bg-emerald-50 border-emerald-200",
        icon: Zap,
        text: "Live",
        description: "Domain is active and serving traffic",
      },
      failed: {
        color: "text-red-700",
        bg: "bg-red-50 border-red-200",
        icon: XCircle,
        text: "Failed",
        description: "Verification or deployment failed",
      },
    };
    return configs[status] || configs.pending;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showSuccess("Copied!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          <p className="text-sm text-slate-500">Loading domain settings...</p>
        </div>
      </div>
    );
  }

  const statusConfig = savedDomain ? getStatusConfig(savedDomain.status) : null;
  const StatusIcon = statusConfig?.icon;

  return (
    <div className="space-y-6">
      {(create.isPending || verifying) && (
        <SubmittingLoader status={verifying ? "Verifying domain" : "Saving domain"} />
      )}
      <DashboardHeading
        title="Custom Domain"
        description="Connect your own domain to serve this application"
      />

      <div className="space-y-6">
        {/* Status Banner */}
        {savedDomain && statusConfig && (
          <div className={`flex items-center gap-4 p-4 rounded-xl border ${statusConfig.bg}`}>
            <div className={`p-2 rounded-lg bg-white/80 ${statusConfig.color}`}>
              <StatusIcon className={`h-5 w-5 ${savedDomain.status === "verifying" ? "animate-spin" : ""}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${statusConfig.color}`}>
                  {statusConfig.text}
                </span>
                {savedDomain.status === "active" && (
                  <a
                    href={`https://${savedDomain.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800 bg-white px-2 py-0.5 rounded-full border border-purple-200 transition-colors"
                  >
                    Visit
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{statusConfig.description}</p>
            </div>
            {savedDomain.domain && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200">
                <Globe className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs font-mono font-medium text-slate-700">{savedDomain.domain}</span>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {savedDomain?.errorMessage && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{savedDomain.errorMessage}</p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Domain Input - Left */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-xl">
                    <Globe className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Domain Configuration</h3>
                    <p className="text-xs text-slate-500">Enter the domain you want to connect</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Domain Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Domain</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value.toLowerCase())}
                    placeholder="example.com"
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                  <p className="text-xs text-slate-400">Enter your root domain (e.g., shop.com, brand.com)</p>
                </div>

                {/* Preview */}
                {domain && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Globe className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-purple-600 font-medium">Your site will be available at</p>
                      <p className="text-sm font-bold text-purple-900 font-mono truncate">https://{domain}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-purple-400" />
                  </div>
                )}

                {/* Action Button */}
                <div className="flex items-center gap-3 pt-2">
                  {!savedDomain ? (
                    <PrimaryButton
                      text={create.isPending ? "Saving..." : "Save Domain"}
                      onClick={handleSave}
                      disabled={create.isPending || !domain}
                    />
                  ) : (
                    <PrimaryButton
                      text="Verify & Deploy"
                      onClick={handleVerify}
                      disabled={savedDomain.status === "active"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DNS Instructions - Right */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-xl">
                  <Server className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">DNS Setup</h3>
                  <p className="text-xs text-slate-500">Configure your domain DNS records</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Option 1: Nameservers */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold">1</span>
                  <h4 className="text-sm font-semibold text-slate-900">Nameservers</h4>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Recommended</span>
                </div>
                <p className="text-xs text-slate-500 pl-7">Update your domain nameservers at your registrar</p>
                <div className="ml-7 space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="font-mono text-sm text-slate-700">ns1.yourdomain.com</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("ns1.yourdomain.com", "ns1")}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                    >
                      {copiedField === "ns1" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="font-mono text-sm text-slate-700">ns2.yourdomain.com</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("ns2.yourdomain.com", "ns2")}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                    >
                      {copiedField === "ns2" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-100"></div>
                <span className="text-xs font-medium text-slate-400 uppercase">or</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>

              {/* Option 2: A Record */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold">2</span>
                  <h4 className="text-sm font-semibold text-slate-900">A Record</h4>
                </div>
                <p className="text-xs text-slate-500 pl-7">Add an A record pointing to our server</p>
                <div className="ml-7">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-md">A</span>
                      <span className="text-xs text-slate-400">@</span>
                      <ArrowRight className="h-3 w-3 text-foreground" />
                      <span className="font-mono text-sm text-slate-700">YOUR_VPS_IP</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("YOUR_VPS_IP", "a-record")}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                    >
                      {copiedField === "a-record" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700 space-y-1">
                  <p className="font-medium">SSL certificates are automatic</p>
                  <p>Once DNS is verified, we&apos;ll automatically provision a free Let&apos;s Encrypt SSL certificate for your domain.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
