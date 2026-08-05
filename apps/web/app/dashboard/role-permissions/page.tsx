"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  getRolePermissionsMap,
  syncRolePermissions,
  type Permission,
  type RolePermissionsMap,
} from "@/actions/permission-action";
import { showSuccess, showWarning, showError } from "@/lib/toast-helper";
import {
  Shield,
  Save,
  Search,
  ChevronDown,
  ChevronRight,
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const roleColors: Record<string, { bg: string; text: string; ring: string }> = {
  admin: { bg: "bg-indigo-600", text: "text-white", ring: "ring-indigo-600" },
  editor: { bg: "bg-emerald-600", text: "text-white", ring: "ring-emerald-600" },
  manager: { bg: "bg-amber-600", text: "text-white", ring: "ring-amber-600" },
  customer: { bg: "bg-slate-600", text: "text-white", ring: "ring-slate-600" },
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
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full
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
          pointer-events-none inline-block h-4 w-4 transform rounded-full
          bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}

function ResourceCard({
  resource,
  permissions,
  selectedRole,
  checkedPermissions,
  onToggle,
}: {
  resource: string;
  permissions: Permission[];
  selectedRole: string;
  checkedPermissions: Set<string>;
  onToggle: (key: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
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
      if (allEnabled || (someEnabled && !isEnabled)) {
        onToggle(p.key);
      } else if (!isEnabled) {
        onToggle(p.key);
      }
    });
  };

  return (
    <div className={`rounded-xl border ${colors.border} bg-white overflow-hidden transition-all duration-200 hover:shadow-md`}>
      <div
        className={`flex items-center justify-between px-4 py-3 cursor-pointer ${colors.bg} select-none`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`${colors.text}`}>{icon}</div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-800">
              {formatResourceName(resource)}
            </span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {enabledCount}/{permissions.length}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleAll();
            }}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${
              allEnabled
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : someEnabled
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {allEnabled ? "All On" : someEnabled ? "Some" : "All Off"}
          </button>
          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {expanded && (
        <div className="divide-y divide-slate-100">
          {permissions.map((perm) => {
            const isChecked = checkedPermissions.has(perm.key);
            return (
              <div
                key={perm.key}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isChecked ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {formatAction(perm.action)}
                  </span>
                  {perm.description && (
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {perm.description}
                    </span>
                  )}
                </div>
                <ToggleSwitch
                  checked={isChecked}
                  onChange={() => onToggle(perm.key)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function RolePermissionsPage() {
  const [data, setData] = useState<RolePermissionsMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getRolePermissionsMap();
      setData(result);
    } catch {
      showError("Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const roles = useMemo(() => {
    if (!data) return [];
    return data.roles.filter((role) => role !== "super_admin");
  }, [data]);

  const groupedPermissions = useMemo(() => {
    if (!data) return {};
    const grouped: Record<string, Permission[]> = {};
    data.permissions.forEach((perm) => {
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
  }, [data]);

  const currentRolePermissions = useMemo(() => {
    if (!data || !selectedRole) return new Set<string>();
    return new Set(
      data.rolePermissions[selectedRole]?.map((p) => p.key) || []
    );
  }, [data, selectedRole]);

  const checkedPermissions = useMemo(() => {
    if (pendingChanges.size > 0) return pendingChanges;
    return currentRolePermissions;
  }, [pendingChanges, currentRolePermissions]);

  const filteredResources = useMemo(() => {
    const keys = Object.keys(groupedPermissions);
    if (!searchTerm) return keys;
    return keys.filter((resource) =>
      resource.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groupedPermissions, searchTerm]);

  const totalEnabled = useMemo(() => {
    return checkedPermissions.size;
  }, [checkedPermissions]);

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

  const handleRoleChange = async (role: string) => {
    if (hasUnsavedChanges) {
      setSaving(true);
      const result = await syncRolePermissions(selectedRole, Array.from(pendingChanges));
      if (result.success) {
        showWarning("Unsaved changes saved automatically");
        await fetchData();
      }
      setSaving(false);
    }
    setPendingChanges(new Set());
    setSelectedRole(role);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await syncRolePermissions(
        selectedRole,
        Array.from(pendingChanges)
      );
      if (result.success) {
        setPendingChanges(new Set());
        showSuccess(`Permissions updated for ${selectedRole}`);
        await fetchData();
      } else {
        showError("Failed to update permissions");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPendingChanges(new Set());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-slate-500">Loading permissions...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Failed to load permissions</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-indigo-100">
              <Shield className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Role Permissions
              </h1>
              <p className="text-xs text-slate-500">
                Control what each role can access in the admin panel
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Role Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Select Role
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {roles.map((role) => {
              const isSelected = selectedRole === role;
              const rolePermCount =
                data.rolePermissions[role]?.length || 0;
              const colors = roleColors[role] ?? roleColors.admin!;

              return (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`
                    relative flex items-center gap-3 px-5 py-3 rounded-xl
                    border-2 transition-all duration-200
                    ${
                      isSelected
                        ? `${colors.bg} ${colors.text} border-transparent shadow-lg scale-[1.02]`
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md"
                    }
                  `}
                >
                  <Shield className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-sm font-semibold capitalize">
                      {role.replace("_", " ")}
                    </div>
                    <div
                      className={`text-xs ${
                        isSelected ? "text-white/80" : "text-slate-400"
                      }`}
                    >
                      {rolePermCount} permissions
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-white rounded-full flex items-center justify-center shadow">
                      <Check className="h-3 w-3 text-emerald-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-slate-900">{totalEnabled}</strong> of{" "}
                {data.permissions.length} permissions enabled
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white w-56"
              />
            </div>
          </div>

          {hasUnsavedChanges && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Resource Cards */}
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource}
              resource={resource}
              permissions={groupedPermissions[resource]!}
              selectedRole={selectedRole}
              checkedPermissions={checkedPermissions}
              onToggle={handleToggle}
            />
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              No resources found matching &quot;{searchTerm}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Sticky Save Bar */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>
                Unsaved changes for{" "}
                <strong className="capitalize">
                  {selectedRole.replace("_", " ")}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
