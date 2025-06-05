import { API_URL } from "@/constants";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { getCookie } from "cookies-next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createClientAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      "Accept-Language": getCookie("NEXT_LOCALE"),
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 406) {
        const pathname = window.location.pathname;
        const locale = getCookie("NEXT_LOCALE");
        if (
          pathname !== `/${locale}/dashboard/settings/identity-verification`
        ) {
          window.location.href = `/${locale}/dashboard/settings/identity-verification`;
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
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
