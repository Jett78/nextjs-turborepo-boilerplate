"use client";

import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { apiClient, TOKEN_TYPES } from "@/lib/api-client";
import type { PaginatedResponse, CommonResponse } from "@/types/base-entity";

interface UseCrudOptions {
  endpoint: string;
  queryKey: string;
  isAuthenticated?: boolean;
}

interface ListParams {
  skip?: number;
  take?: number;
  search?: string;
  [key: string]: unknown;
}

export function useCrud<T extends { id: string }>({
  endpoint,
  queryKey,
  isAuthenticated = false,
}: UseCrudOptions) {
  const queryClient = useQueryClient();
  const keys = {
    all: [queryKey] as const,
    lists: () => [...keys.all, "list"] as const,
    list: (params?: ListParams) => [...keys.lists(), params ?? {}] as const,
    details: () => [...keys.all, "detail"] as const,
    detail: (id: string) => [...keys.details(), id] as const,
  };

  const getAll = (params?: ListParams) => {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set("skip", String(params.skip));
    if (params?.take !== undefined) searchParams.set("take", String(params.take));
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString();
    const url = query ? `${endpoint}?${query}` : endpoint;

    return useQuery({
      queryKey: keys.list(params),
      queryFn: () =>
        apiClient<CommonResponse<PaginatedResponse<T>>>(url, {
          isAuthenticated,
          tokenType: isAuthenticated ? TOKEN_TYPES.USER : undefined,
        }),
    });
  };

  const getOne = (id: string) => {
    return useQuery({
      queryKey: keys.detail(id),
      queryFn: () =>
        apiClient<CommonResponse<T>>(`${endpoint}/${id}`, {
          isAuthenticated,
          tokenType: isAuthenticated ? TOKEN_TYPES.USER : undefined,
        }),
    });
  };

  const create = useMutation({
    mutationFn: (data: Partial<T>) =>
      apiClient<CommonResponse<T>>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
        isAuthenticated,
        tokenType: isAuthenticated ? TOKEN_TYPES.USER : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
      apiClient<CommonResponse<T>>(`${endpoint}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        isAuthenticated,
        tokenType: isAuthenticated ? TOKEN_TYPES.USER : undefined,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
      queryClient.invalidateQueries({ queryKey: keys.detail(id) });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) =>
      apiClient<CommonResponse<null>>(`${endpoint}/${id}`, {
        method: "DELETE",
        isAuthenticated,
        tokenType: isAuthenticated ? TOKEN_TYPES.USER : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });

  return { getAll, getOne, create, update, remove, keys };
}
