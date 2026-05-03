import type { CookieOptions } from "express";

/**
 * SPA on one host (e.g. Vercel) + API on another (e.g. Render) is cross-site.
 * Browsers only send cookies on those XHR/fetch requests if SameSite=None and Secure=true.
 * Local same-origin-ish dev keeps Lax + non-secure.
 */
function crossSiteProductionCookies(): boolean {
  return process.env.NODE_ENV === "production";
}

/** Options shared by set + clear so logout actually removes the cookie. */
export function authCookieBase(): Pick<
  CookieOptions,
  "path" | "sameSite" | "secure"
> {
  if (crossSiteProductionCookies()) {
    return { path: "/", sameSite: "none", secure: true };
  }
  return { path: "/", sameSite: "lax", secure: false };
}

export function authCookieOptions(maxAge: number): CookieOptions {
  return {
    ...authCookieBase(),
    httpOnly: true,
    maxAge,
  };
}
