import { DynamicString } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getCommentText = (count: number, locale: string) => {
  if (locale === "ar") {
    if (count === 0) return "لا تعليقات";
    if (count === 1) return "تعليق واحد";
    if (count === 2) return "تعليقان";
    if (count >= 3 && count <= 10) return `${count} تعليقات`;
    return `${count} تعليق`;
  } else {
    return count === 1 ? "1 comment" : `${count} comments`;
  }
};
export const getDynamicString = (string: DynamicString | null | undefined) => {
  if (!string) {
    return "";
  }
  if (typeof string === "string") {
    return string;
  }
  return string.localized ?? "";
};
export const getStringObject = (string: DynamicString | null | undefined) => {
  if (!string) {
    return {
      ar: "",
      en: "",
    };
  }
  if (typeof string === "string") {
    return {
      ar: string,
      en: string,
    };
  }
  return {
    ar: string.ar ?? "",
    en: string.en ?? "",
  };
};
