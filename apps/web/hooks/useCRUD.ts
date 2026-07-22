"use client";

import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CrudOptions } from "@/types/hooks";

export function useCrud<T>({
  endpoint,
  queryKey,
  isAuthenticated,
}: CrudOptions<T>) {
  const queryClient = useQueryClient();

  const getAll = (params?: Record<string, string | number | boolean>) => {
    const queryString = params
      ? "?" +
        Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== "")
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&")
      : "";

    return useQuery({
      queryKey: [queryKey, params],
      queryFn: async () => {
        const response = await apiClient<any>(`${endpoint}${queryString}`, { isAuthenticated });
        return response?.data?.data || response?.data || [];
      },
    });
  };

  const getOne = (id: string | number) =>
    useQuery({
      queryKey: [queryKey, id],
      queryFn: async () => {
        const response = await apiClient<any>(`${endpoint}/${id}`);
        return response?.data || response;
      },
      enabled: !!id,
    });

  const create = useMutation({
    mutationFn: (data: T) =>
      apiClient(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
        isAuthenticated: isAuthenticated,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: T }) =>
      apiClient(`${endpoint}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        isAuthenticated: isAuthenticated,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  const put = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: T }) =>
      apiClient(`${endpoint}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        isAuthenticated: isAuthenticated,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string | number) =>
      apiClient(`${endpoint}/${id}`, {
        method: "DELETE",
        isAuthenticated: isAuthenticated,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  return {
    getAll,
    getOne,
    create,
    update,
    remove,
    put,
  };
}
