"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Calendar,
  UserCheck,
  UserX,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

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
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/users`,
        { credentials: "include" }
      );
      const data = await response.json();
      if (data.success) {
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setDeletingUserId(userToDelete.id);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/users/${userToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setUsers(users.filter((u) => u.id !== userToDelete.id));
        setShowDeleteModal(false);
        setUserToDelete(null);
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 mt-1 text-xs">
            Manage registered users and their roles.
          </p>
        </div>
        <div className="text-sm text-slate-500">
          Total: {users.length} users
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-slate-400" />
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
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 text-slate-400 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="size-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {user.emailVerified ? (
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
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="size-3.5" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteClick(user)}
                        disabled={deletingUserId === user.id}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50"
                        title="Delete user"
                      >
                        {deletingUserId === user.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="size-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 mb-1">No users found</h3>
            <p className="text-sm text-slate-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowDeleteModal(false);
              setUserToDelete(null);
            }}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-100 rounded-full">
                <AlertTriangle className="size-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete User</h3>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{userToDelete.name}</span>? This
              action cannot be undone and will remove all their data.
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deletingUserId === userToDelete.id}
              >
                {deletingUserId === userToDelete.id ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
