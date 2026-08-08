"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useFilterParam(paramKey?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Получаем текущее выбранное значение для конкретного ключа из URL
  const selectedValue = paramKey ? (searchParams.get(paramKey) ?? "") : "";

  // Если у вас фильтр с множественным выбором (через запятую)
  const selectedValuesArray = selectedValue ? selectedValue.split(",") : [];

  // Функция для точечного обновления только этого параметра в URL
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

  // Clear ONLY this parameter
  const clearParam = useCallback(() => {
    if (!paramKey) return;
    updateParam(null);
  }, [updateParam, paramKey]);

  // Clear ALL search parameters completely
  const clearAllParams = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    selectedValue,
    selectedValuesArray,
    updateParam,
    clearParam,
    clearAllParams,
  };
}
