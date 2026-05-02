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

export const sanitizeAuthRedirect = (
  redirect?: string | null,
  fallback = "",
) => {
  if (!redirect) return fallback;

  try {
    const decodedRedirect = decodeURIComponent(redirect).trim();

    if (
      !decodedRedirect.startsWith("/") ||
      decodedRedirect.startsWith("//") ||
      decodedRedirect.includes("://") ||
      decodedRedirect.toLowerCase().startsWith("/\\")
    ) {
      return fallback;
    }

    return decodedRedirect;
  } catch {
    return fallback;
  }
};

export const buildAuthHref = (path: string, redirect?: string | null) => {
  const safeRedirect = sanitizeAuthRedirect(redirect);
  if (!safeRedirect) return path;

  const params = new URLSearchParams();
  params.set("redirect", safeRedirect);
  return `${path}?${params.toString()}`;
};

export const getRedirectFromSearchParams = (
  searchParams?: AuthSearchParams,
) => sanitizeAuthRedirect(searchParams?.get("redirect"));

export const rememberAuthRedirect = (redirect?: string | null) => {
  const safeRedirect = sanitizeAuthRedirect(redirect);
  if (typeof window === "undefined" || !safeRedirect) return;
  window.sessionStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, safeRedirect);
};

export const getStoredAuthRedirect = () => {
  if (typeof window === "undefined") return "";
  return sanitizeAuthRedirect(
    window.sessionStorage.getItem(AUTH_REDIRECT_STORAGE_KEY),
  );
};

export const getAuthRedirect = (searchParams?: AuthSearchParams) =>
  getRedirectFromSearchParams(searchParams) || getStoredAuthRedirect();

export const clearStoredAuthRedirect = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
};
