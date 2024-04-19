"use server";

import { cookies } from "next/headers";

export async function getPathnames() {
  const locale = cookies().get("NEXT_LOCALE")?.value || "vi";
  const withLocaleAdmin = `/${locale}/admin`;
  const withLocaleEU = `/${locale}`;
  return {
    // End User
    HOME: withLocaleEU + "/",
    HOME_CAT_SUB: (cat: string, sub: string) => withLocaleEU + `/${cat}/${sub}`,
    // Admin
    DASHBOARD: withLocaleAdmin + "/",
    CATEGORY: {
      LIST: withLocaleAdmin + "/category",
      CREATE: withLocaleAdmin + "/category/create",
    },
  };
}
