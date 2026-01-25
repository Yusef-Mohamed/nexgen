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

export const getReactionText = (
  totalCount: number,
  hasUserReaction: boolean,
  locale: string
) => {
  if (!hasUserReaction) {
    // If user hasn't reacted, just show the count
    if (locale === "ar") {
      if (totalCount === 0) return "لا تفاعلات";
      if (totalCount === 1) return "تفاعل واحد";
      if (totalCount === 2) return "تفاعلان";
      if (totalCount >= 3 && totalCount <= 10) return `${totalCount} تفاعلات`;
      return `${totalCount} تفاعل`;
    } else {
      return totalCount === 1 ? "1 reaction" : `${totalCount} reactions`;
    }
  }

  // User has reacted
  if (totalCount === 1) {
    return locale === "ar" ? "أنت" : "You";
  }

  const othersCount = totalCount - 1;
  if (locale === "ar") {
    if (othersCount === 1) return "أنت وآخر";
    if (othersCount === 2) return "أنت وآخران";
    if (othersCount >= 3 && othersCount <= 10)
      return `أنت و${othersCount} آخرين`;
    return `أنت و${othersCount} آخر`;
  } else {
    return `You and ${othersCount} more`;
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
export const isImageFile = (url: string | null | undefined) => {
  if (!url) return false;
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
  ];
  const urlLower = url.toLowerCase();
  return imageExtensions.some((ext) => urlLower.includes(ext));
};
