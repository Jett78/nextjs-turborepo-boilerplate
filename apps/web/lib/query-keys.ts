export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...blogKeys.lists(), params ?? {}] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
  slug: (slug: string) => [...blogKeys.all, "slug", slug] as const,
};
