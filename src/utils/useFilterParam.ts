"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useFilterParam(paramKey?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedValue = paramKey ? (searchParams.get(paramKey) ?? "") : "";

  const selectedValuesArray = selectedValue ? selectedValue.split(",") : [];

  const updateParam = useCallback(
    (newValue: string | string[] | null | undefined) => {
      if (!paramKey) return;

      const params = new URLSearchParams(searchParams.toString());

      if (!newValue || (Array.isArray(newValue) && newValue.length === 0)) {
        params.delete(paramKey);
      } else if (Array.isArray(newValue)) {
        params.set(paramKey, newValue.join(","));
      } else {
        params.set(paramKey, newValue);
      }

      params.set("offset", "0");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [paramKey, searchParams, pathname, router],
  );

  const clearParam = useCallback(() => {
    if (!paramKey) return;
    updateParam(null);
  }, [updateParam, paramKey]);

  const clearSpecificParams = useCallback(
    (keysToClear: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      keysToClear.forEach((key) => {
        params.delete(key);
      });

      params.set("offset", "0");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const clearAllParams = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    selectedValue,
    selectedValuesArray,
    updateParam,
    clearParam,
    clearSpecificParams,
    clearAllParams,
  };
}
