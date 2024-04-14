import en from "./en.json";

import "server-only";

const dictionaries: { [key: string]: () => Promise<typeof en> } = {
  en: () => import("./en.json").then((module) => module.default),
  vi: () => import("./vi.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => dictionaries[locale]();
