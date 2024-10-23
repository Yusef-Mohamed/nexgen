import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

function useCustomSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setSearchParams = (values: any) => {
    const newSearchParams = new URLSearchParams(searchParams);
    for (const key in values) {
      if (values[key] === "") {
        newSearchParams.delete(key);
        continue;
      }
      newSearchParams.set(key, values[key]);
    }
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };
  const getSearchParam = (key: string) => {
    return searchParams.get(key);
  };
  const clearSearchParams = () => {
    router.push(pathname);
  };

  return { setSearchParams, getSearchParam, searchParams, clearSearchParams };
}

export default useCustomSearchParams;
