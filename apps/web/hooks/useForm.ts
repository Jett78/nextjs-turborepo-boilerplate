"use client";

import { useState } from "react";
import type { Errors } from "@/types/hooks";

export function useForm<T extends Record<string, any>>(initialState: T) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Errors<T>>({});

  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split(".");
    const lastKey = keys.pop()!;
    let temp = { ...obj };
    let current = temp;

    for (const key of keys) {
      current[key] = { ...current[key] };
      current = current[key];
    }

    current[lastKey] = value;
    return temp;
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    let parsedValue: any = value;

    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value);
    }

    if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    }

    setValues((prev) => setNestedValue(prev, name, parsedValue));

    if (errors[name as keyof T]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const setField = (field: keyof T | string, value: any) => {
    setValues((prev) => setNestedValue(prev, field as string, value));
  };

  const reset = () => {
    setValues(initialState);
    setErrors({});
  };

  const clearErrors = () => setErrors({});

  return {
    values,
    errors,
    setErrors,
    handleChange,
    setField,
    reset,
    clearErrors,
  };
}
