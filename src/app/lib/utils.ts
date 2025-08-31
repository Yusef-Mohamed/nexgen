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

export const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const language = getCookie("NEXT_LOCALE") || "en";
    const token = getCookie("token");
    config.headers["Accept-Language"] = language;
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// // Response interceptor to handle errors
// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: unknown) => {
//     if (axios.isAxiosError(error) && error.response?.status === 401) {
//       // Handle unauthorized access
//       localStorage.setItem("error", JSON.stringify(error));
//       const language = Cookies.get("NEXT_LOCALE") || "en";
//       const pathName = window.location.pathname;
//       const pathNameWithoutLocale = pathName.replace(`/${language}`, "");
//       sessionStorage.setItem("redirect", pathNameWithoutLocale);
//       sessionStorage.setItem("lastError", JSON.stringify(error));
//       window.location.href = `/${language}/sign-in`;
//       Cookies.remove("token");
//       Cookies.remove("user");
//     }
//     return Promise.reject(error);
//   }
// );
