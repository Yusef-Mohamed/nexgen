import { API_URL } from "@/constants";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { getCookie } from "cookies-next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createClientAxiosInstance = () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      "Accept-Language": getCookie("NEXT_LOCALE"),
    },
  });
};
export const getClientCookie = (name: string, isObject?: boolean) => {
  const string = getCookie(name);
  if (string) {
    if (isObject) {
      return JSON.parse(string);
    }
    return string;
  }
  return null;
};
