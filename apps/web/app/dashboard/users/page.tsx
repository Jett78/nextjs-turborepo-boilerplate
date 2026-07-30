"use client";

import { useState, useEffect } from "react";
import DashboardHeading from "@/components/dashboard/dashboard-heading";
import DataTable, { Column } from "@/components/dashboard/data-table";
import { Search, UserCheck, UserX, Calendar, Users, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { DeleteButton } from "@/components/dashboard/delete-button";
import UserModal from "./user-modal";
import type { User } from "@/types/user";
import Image from "next/image";

const getRoleBadge = (role: string) => {
  const roleStyles: Record<string, string> = {
    super_admin: "bg-rose-50 text-rose-700 border-rose-200",
    admin: "bg-purple-50 text-purple-700 border-purple-200",
    manager: "bg-blue-50 text-blue-700 border-blue-200",
    customer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return roleStyles[role] || "bg-slate-50 text-slate-700 border-slate-200";
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch current user to prevent self-deletion
  const { getAll: getCurrentUser } = useCrud<User>({
    endpoint: `${API_ROUTES.AUTH}/profile`,
    queryKey: "current-user",
    isAuthenticated: true,
  });

  const { data: currentUserData } = getCurrentUser();
  const currentUser = currentUserData as User | undefined;

  const { getAll } = useCrud<User>({
    endpoint: API_ROUTES.USER,
    queryKey: "users",
    isAuthenticated: true,
  });

  const { data, isLoading, isError, error } = getAll({ limit: 100 });

  const users = (data as User[]) || [];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns: Column<User>[] = [
    {
      key: "name",
      label: "User",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            {row.image ? (
              <Image
                src={row.image}
                alt={row.name}
                height={500}
                width={500}
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="size-5 text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {row.name}
            </p>
            <p className="text-xs text-slate-500 truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(
            row.role
          )}`}
        >
          {row.role.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "emailVerified",
      label: "Status",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.emailVerified ? (
            <>
              <UserCheck className="size-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-700">
                Verified
              </span>
            </>
          ) : (
            <>
              <UserX className="size-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-500">
                Unverified
              </span>
            </>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="size-3.5" />
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedUser(row)}
            className="h-8 px-3"
          >
            <Eye className="size-3.5 mr-1" />
            View
          </Button>
          {currentUser?.id !== row.id && (
            <DeleteButton
              id={row.id}
              endpoint={API_ROUTES.USER}
              queryKey="users"
              entityName="user"
            />
          )}
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="p-8 text-center text-rose-600 font-bold">
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DashboardHeading
        title="Users"
        description="Manage registered users and their roles."
        path="users"
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 h-11 bg-white border-slate-200 rounded-md focus:ring-primary/20 focus:border-primary transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "customer", "admin", "manager", "super_admin"].map(
            (role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-colors ${
                  roleFilter === role
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {role === "all" ? "All" : role.replace("_", " ")}
              </button>
            )
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        className="shadow-2xl shadow-slate-200/40"
      />

      <UserModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
