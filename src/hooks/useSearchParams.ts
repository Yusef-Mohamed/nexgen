import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

function useCustomSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setSearchParams = useCallback(
    (values: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams);
      for (const key in values) {
        if (values[key] === "") {
          newSearchParams.delete(key);
          continue;
        }
        newSearchParams.set(key, values[key]);
      }
      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, searchParams],
  );
  const getSearchParam = (key: string) => {
    return searchParams.get(key);
  };
  const clearSearchParams = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return { setSearchParams, getSearchParam, searchParams, clearSearchParams };
}

export default useCustomSearchParams;
