"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useFilterParam(paramKey: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Получаем текущее выбранное значение для конкретного ключа из URL
  const selectedValue = searchParams.get(paramKey) ?? "";

  // Если у вас фильтр с множественным выбором (через запятую)
  const selectedValuesArray = selectedValue ? selectedValue.split(",") : [];

  // Функция для точечного обновления только этого параметра в URL
  const updateParam = useCallback(
    (newValue: string | string[] | null | undefined) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!newValue || (Array.isArray(newValue) && newValue.length === 0)) {
        params.delete(paramKey);
      } else if (Array.isArray(newValue)) {
        params.set(paramKey, newValue.join(","));
      } else {
        params.set(paramKey, newValue);
      }

      // При изменении любого фильтра сбрасываем пагинацию на 0
      params.set("offset", "0");

      // Обновляем URL (scroll: false предотвращает прыжки страницы)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [paramKey, searchParams, pathname, router],
  );

  return { selectedValue, selectedValuesArray, updateParam };
}
