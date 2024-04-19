import createIntlMiddleware from "next-intl/middleware";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  // Step 1: Use the incoming request (example)
  const defaultLocale = request.headers.get("x-your-custom-locale") || "vi";

  // Step 2: Create and call the next-intl middleware (example)
  const handleI18nRouting = createIntlMiddleware({
    locales: ["en", "vi"],
    defaultLocale,
  });
  const response = handleI18nRouting(request);

  // Step 3: Alter the response (example)
  response.headers.set("x-your-custom-locale", defaultLocale);

  const url = new URL(request.url);
  response.headers.set("x-pathname", url.pathname);

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(vi|en)/:path*"],
};
