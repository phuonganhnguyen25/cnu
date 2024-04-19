import unidecode from "unidecode";

export function transformStr(str: string) {
  return unidecode(str)
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, "") // Replace non-alphanumeric characters (except spaces) with hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple consecutive hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}
