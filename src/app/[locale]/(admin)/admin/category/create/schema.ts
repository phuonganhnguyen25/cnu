import { ILanguages } from "@/messages/setting";
import * as z from "zod";

export const CATEGORY_MAX_LEVEL = 2;
export const REGEX_VALID_EN_STR =
  /^[A-Za-z][A-Za-z0-9]*(?: [A-Za-z0-9]*[A-Za-z][A-Za-z0-9]*)*$/;
export const REGEX_VALID_VI_STR = /^[\p{L}].*[\p{L}\p{N}]$/u;

export const nameEnSchema = (lang: ILanguages) =>
  z
    .string()
    .min(1, lang["Category"]["Error_Msg"]["Min_Name_Str"])
    .regex(REGEX_VALID_EN_STR, lang["Category"]["Error_Msg"]["Name_Invalid"])
    .max(30, lang["Category"]["Error_Msg"]["Max_Name_Str"]);

export const nameViSchema = (lang: ILanguages) =>
  z
    .string()
    .min(1, lang["Category"]["Error_Msg"]["Min_Name_Str"])
    .regex(REGEX_VALID_VI_STR, lang["Category"]["Error_Msg"]["Name_Invalid"])
    .max(30, lang["Category"]["Error_Msg"]["Max_Name_Str"]);

export function CreateCategorySchema(lang: ILanguages) {
  return z.object({
    name_en: nameEnSchema(lang),
    name_vi: nameViSchema(lang),
    parent_id: z.number().optional(),
  });
}

export function UpdateCategorySchema(lang: ILanguages) {
  return z.object({
    name_en: nameEnSchema(lang).optional(),
    name_vi: nameViSchema(lang).optional(),
    parent_id: z.number().nullable(),
    id: z.number().min(1),
  });
}
