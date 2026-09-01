import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const localeMatch = request.nextUrl.pathname.match(/^\/(ar|en)(?=\/|$)/);
  const locale = localeMatch?.[1] || routing.defaultLocale;
  const pathnameWithoutLocale = localeMatch
    ? request.nextUrl.pathname.slice(locale.length + 1) || "/"
    : request.nextUrl.pathname;
  const requiresAuthentication = /^\/(dashboard|checkout)(?:\/|$)/.test(
    pathnameWithoutLocale,
  );

  if (requiresAuthentication && !request.cookies.get("token")?.value) {
    const signInUrl = new URL(`/${locale}/sign-in`, request.url);
    signInUrl.searchParams.set(
      "redirect",
      `${pathnameWithoutLocale}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(signInUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
