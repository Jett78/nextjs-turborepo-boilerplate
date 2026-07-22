export type Errors<T> = Partial<Record<keyof T, string>>;

export type CrudOptions<T> = {
  endpoint: string;
  queryKey: string;
  isAuthenticated?: boolean;
};
