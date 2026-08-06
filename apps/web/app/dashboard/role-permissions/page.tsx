"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useCrud } from "@/hooks/useCRUD";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import { showSuccess, showError } from "@/lib/toast-helper";
import {
  Shield,
  Search,
  ChevronDown,
  FileText,
  Briefcase,
  Star,
  UsersRound,
  HelpCircle,
  User,
  MessageSquare,
  Building2,
  SearchCode,
  FileCode,
  ArrowRightLeft,
  CreditCard,
  Globe,
  LayoutDashboard,
  Check,
  RotateCcw,
} from "lucide-react";
import PrimaryButton from "@/components/ui/primary-button";
import { Input } from "@/components/ui/input";
import DashboardHeading from "@/components/dashboard/dashboard-heading";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import Loading from "@/app/loading";

interface Permission {
  id: string;
  resource: string;
  action: string;
  key: string;
  description: string | null;
}

interface RolePermissionsMap {
  roles: string[];
  permissions: Permission[];
  rolePermissions: Record<string, Permission[]>;
}

const resourceIcons: Record<string, React.ReactNode> = {
  blog: <FileText className="h-4 w-4" />,
  service: <Briefcase className="h-4 w-4" />,
  testimonial: <Star className="h-4 w-4" />,
  team: <UsersRound className="h-4 w-4" />,
  faq: <HelpCircle className="h-4 w-4" />,
  user: <User className="h-4 w-4" />,
  inquiry: <MessageSquare className="h-4 w-4" />,
  company_profile: <Building2 className="h-4 w-4" />,
  seo: <SearchCode className="h-4 w-4" />,
  page_seo: <FileCode className="h-4 w-4" />,
  redirect: <ArrowRightLeft className="h-4 w-4" />,
  payment_settings: <CreditCard className="h-4 w-4" />,
  domain: <Globe className="h-4 w-4" />,
  dashboard: <LayoutDashboard className="h-4 w-4" />,
};

const resourceColors: Record<string, { bg: string; text: string; border: string }> = {
  blog: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  service: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  testimonial: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  team: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  faq: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200" },
  user: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
  inquiry: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
  company_profile: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
  seo: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
  page_seo: { bg: "bg-fuchsia-50", text: "text-fuchsia-600", border: "border-fuchsia-200" },
  redirect: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  payment_settings: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200" },
  domain: { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200" },
  dashboard: { bg: "bg-lime-50", text: "text-lime-600", border: "border-lime-200" },
};

const roleBadgeStyles: Record<string, string> = {
  admin: "bg-purple-50 text-purple-700 border-purple-200",
  editor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  manager: "bg-blue-50 text-blue-700 border-blue-200",
  customer: "bg-slate-50 text-slate-700 border-slate-200",
};

function formatResourceName(resource: string): string {
  return resource
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatAction(action: string): string {
  return action
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function ToggleSwitch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`
        relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full
        transition-colors duration-200 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${
          checked
            ? "bg-emerald-500 focus-visible:ring-emerald-500"
            : "bg-slate-300 focus-visible:ring-slate-400"
        }
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full
          bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out
          ${checked ? "translate-x-4.5" : "translate-x-0.5"}
        `}
      />
    </button>
  );
}

function ResourceCard({
  resource,
  permissions,
  checkedPermissions,
  onToggle,
}: {
  resource: string;
  permissions: Permission[];
  checkedPermissions: Set<string>;
  onToggle: (key: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = resourceColors[resource] ?? resourceColors.blog!;
  const icon = resourceIcons[resource] || <Shield className="h-4 w-4" />;

  const enabledCount = permissions.filter((p) =>
    checkedPermissions.has(p.key)
  ).length;
  const allEnabled = enabledCount === permissions.length;
  const someEnabled = enabledCount > 0 && !allEnabled;

  const toggleAll = () => {
    permissions.forEach((p) => {
      const isEnabled = checkedPermissions.has(p.key);
      if (allEnabled) {
        onToggle(p.key);
      } else if (!isEnabled) {
        onToggle(p.key);
      }
    });
  };

  return (
    <div className="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center h-8 w-8 rounded-md ${colors.bg} ${colors.text}`}>
            {icon}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">
              {formatResourceName(resource)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {enabledCount}/{permissions.length} enabled
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleAll();
            }}
            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full transition-colors ${
              allEnabled
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : someEnabled
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {allEnabled ? "ALL" : someEnabled ? "PARTIAL" : "NONE"}
          </button>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>
                <th className="px-6 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Description
                </th>
                <th className="px-6 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Enabled
                </th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => {
                const isChecked = checkedPermissions.has(perm.key);
                return (
                  <tr
                    key={perm.key}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-2.5">
                      <span className="text-xs font-semibold text-slate-900">
                        {formatAction(perm.action)}
                      </span>
                    </td>
                    <td className="px-6 py-2.5">
                      <span className="text-xs text-slate-500">
                        {perm.description || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-2.5 text-right">
                      <ToggleSwitch
                        checked={isChecked}
                        onChange={() => onToggle(perm.key)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function RolePermissionsPage() {
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { getAll } = useCrud<RolePermissionsMap>({
    endpoint: `${API_ROUTES.PERMISSION}/roles`,
    queryKey: "role-permissions",
    isAuthenticated: true,
  });

  const { data, isLoading } = getAll();
  const roleData = data as RolePermissionsMap | undefined;

  const syncMutation = useMutation({
    mutationFn: ({ role, permissionKeys }: { role: string; permissionKeys: string[] }) =>
      apiClient(`${API_ROUTES.PERMISSION}/roles/${role}/sync`, {
        method: "PUT",
        body: JSON.stringify({ permissionKeys }),
        isAuthenticated: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const roles = useMemo(() => {
    if (!roleData) return [];
    return roleData.roles.filter((role) => role !== "super_admin" && role !== "customer");
  }, [roleData]);

  const groupedPermissions = useMemo(() => {
    if (!roleData) return {};
    const grouped: Record<string, Permission[]> = {};
    roleData.permissions.forEach((perm) => {
      if (!grouped[perm.resource]) grouped[perm.resource] = [];
      grouped[perm.resource]!.push(perm);
    });
    Object.keys(grouped).forEach((resource) => {
      grouped[resource]!.sort((a, b) => {
        const order = ["read", "create", "edit", "delete", "view_stats"];
        return order.indexOf(a.action) - order.indexOf(b.action);
      });
    });
    return grouped;
  }, [roleData]);

  const currentRolePermissions = useMemo(() => {
    if (!roleData || !selectedRole) return new Set<string>();
    return new Set(
      roleData.rolePermissions[selectedRole]?.map((p) => p.key) || []
    );
  }, [roleData, selectedRole]);

  const checkedPermissions = useMemo(() => {
    if (pendingChanges.size > 0) return pendingChanges;
    return currentRolePermissions;
  }, [pendingChanges, currentRolePermissions]);

  const filteredResources = useMemo(() => {
    const keys = Object.keys(groupedPermissions);
    if (!debouncedSearch) return keys;
    return keys.filter((resource) =>
      resource.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [groupedPermissions, debouncedSearch]);

  const totalEnabled = checkedPermissions.size;
  const hasUnsavedChanges = pendingChanges.size > 0;

  const handleToggle = useCallback(
    (permissionKey: string) => {
      setPendingChanges((prev) => {
        const next = new Set(prev.size > 0 ? prev : currentRolePermissions);
        if (next.has(permissionKey)) {
          next.delete(permissionKey);
        } else {
          next.add(permissionKey);
        }
        return next;
      });
    },
    [currentRolePermissions]
  );

  const handleRoleChange = (role: string) => {
    setPendingChanges(new Set());
    setSelectedRole(role);
  };

  const handleSave = async () => {
    await syncMutation.mutateAsync(
      { role: selectedRole, permissionKeys: Array.from(pendingChanges) },
      {
        onSuccess: () => {
          setPendingChanges(new Set());
          showSuccess(`Permissions updated for ${selectedRole}`);
        },
        onError: () => showError("Failed to update permissions"),
      }
    );
  };

  const handleReset = () => {
    setPendingChanges(new Set());
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {syncMutation.isPending && <SubmittingLoader status="Saving permissions" />}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <DashboardHeading
          title="Role Permissions"
          description="Control what each role can access in the admin panel."
        />
        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search resources..."
            className="pl-10 h-11 bg-white border-slate-200 rounded-md focus:ring-primary/20 focus:border-primary transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
      <>
      {/* Role Tabs */}
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => {
          const isSelected = selectedRole === role;
          const rolePermCount = roleData.rolePermissions[role]?.length || 0;
          const badgeStyle = roleBadgeStyles[role] ?? "bg-slate-50 text-slate-700 border-slate-200";

          return (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`
                flex items-center gap-2.5 px-4 py-2.5 rounded-md border text-sm font-semibold capitalize transition-all duration-200
                ${
                  isSelected
                    ? "bg-primarymain text-white border-primarymain shadow-md"
                    : `${badgeStyle} hover:shadow-sm`
                }
              `}
            >
              <Shield className="h-3.5 w-3.5" />
              {role.replace("_", " ")}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isSelected ? "bg-white/20 text-white" : "bg-white text-slate-500"
              }`}>
                {rolePermCount}
              </span>
              {isSelected && (
                <Check className="h-3.5 w-3.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Stats + Save Bar */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              <strong className="text-slate-900">{totalEnabled}</strong> of{" "}
              {roleData.permissions.length} permissions enabled
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
          )}
          <PrimaryButton
            text={syncMutation.isPending ? "Saving..." : "Save Changes"}
            onClick={handleSave}
            disabled={syncMutation.isPending}
          />
        </div>
      </div>

      {/* Resource Cards */}
      <div className="space-y-4">
        {filteredResources.map((resource) => (
          <ResourceCard
            key={resource}
            resource={resource}
            permissions={groupedPermissions[resource]!}
            checkedPermissions={checkedPermissions}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Search className="size-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No resources found</h3>
            <p className="text-sm text-slate-500">
              {debouncedSearch ? "Try a different search term." : "No resources available."}
            </p>
          </div>
        </div>
      )}

      </>
      )}
    </div>
  );
}
