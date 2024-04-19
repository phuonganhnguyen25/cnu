import vi from "./vi.json";

import "server-only";

export type ILanguages = typeof vi;

const dictionaries: { [key: string]: () => Promise<typeof vi> } = {
  en: () => import("./en.json").then((module) => module.default),
  vi: () => import("./vi.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => dictionaries[locale]();
