"use server";

import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";

export interface Permission {
  id: string;
  resource: string;
  action: string;
  key: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermissionsMap {
  roles: string[];
  permissions: Permission[];
  rolePermissions: Record<string, Permission[]>;
}

export async function getAllPermissions(): Promise<Permission[]> {
  try {
    const response = await apiClient<{ success: boolean; data: Permission[] }>(
      API_ROUTES.PERMISSION
    );
    if (!response || !response.success) return [];
    return response.data || [];
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return [];
  }
}

export async function getRolePermissionsMap(): Promise<RolePermissionsMap | null> {
  try {
    const response = await apiClient<{ success: boolean; data: RolePermissionsMap }>(
      `${API_ROUTES.PERMISSION}/roles`
    );
    if (!response || !response.success) return null;
    return response.data;
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    return null;
  }
}

export async function getRolePermissions(role: string): Promise<Permission[]> {
  try {
    const response = await apiClient<{ success: boolean; data: Permission[] }>(
      `${API_ROUTES.PERMISSION}/roles/${role}`
    );
    if (!response || !response.success) return [];
    return response.data || [];
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    return [];
  }
}

export async function syncRolePermissions(
  role: string,
  permissionKeys: string[]
): Promise<{ success: boolean }> {
  try {
    const response = await apiClient<{ success: boolean }>(
      `${API_ROUTES.PERMISSION}/roles/${role}/sync`,
      {
        method: "PUT",
        body: JSON.stringify({ permissionKeys }),
      }
    );
    return { success: response?.success || false };
  } catch (error) {
    console.error("Error syncing role permissions:", error);
    return { success: false };
  }
}

export async function getMyPermissions(): Promise<string[]> {
  try {
    const response = await apiClient<{ success: boolean; data: string[] }>(
      `${API_ROUTES.PERMISSION}/me`
    );
    if (!response || !response.success) return [];
    return response.data || [];
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return [];
  }
}
