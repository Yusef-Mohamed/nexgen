export const AUTH_REDIRECT_STORAGE_KEY = "nexgen-auth-redirect";

export type AuthSearchParams =
  | URLSearchParams
  | {
      get: (key: string) => string | null;
      toString?: () => string;
    }
  | null
  | undefined;

export const getCurrentRedirectPath = (
  pathname: string,
  searchParams?: AuthSearchParams,
) => {
  const queryString = searchParams?.toString?.() || "";
  return queryString ? `${pathname}?${queryString}` : pathname;
};

export const buildAuthHref = (path: string, redirect?: string | null) => {
  if (!redirect) return path;

  const params = new URLSearchParams();
  params.set("redirect", redirect);
  return `${path}?${params.toString()}`;
};

export const getRedirectFromSearchParams = (
  searchParams?: AuthSearchParams,
) => searchParams?.get("redirect") || "";

export const rememberAuthRedirect = (redirect?: string | null) => {
  if (typeof window === "undefined" || !redirect) return;
  window.sessionStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, redirect);
};

export const getStoredAuthRedirect = () => {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(AUTH_REDIRECT_STORAGE_KEY) || "";
};

export const getAuthRedirect = (searchParams?: AuthSearchParams) =>
  getRedirectFromSearchParams(searchParams) || getStoredAuthRedirect();

export const clearStoredAuthRedirect = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
};

