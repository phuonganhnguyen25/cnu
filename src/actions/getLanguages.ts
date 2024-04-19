"use server";

import { getDictionary } from "@/messages/setting";
import { cookies } from "next/headers";

export async function getLanguages() {
  const locale = cookies().get("NEXT_LOCALE")?.value || "vi";
  const lang = await getDictionary(locale);

  return { locale, lang };
}
