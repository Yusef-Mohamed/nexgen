import { API_URL } from "@/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const getServerCookie = (key: string, isObject?: boolean) => {
  const cookiesStore = cookies();
  const cookie = cookiesStore.get(key)?.value;
  if (isObject) {
    return JSON.parse(cookie || "{}");
  }
  return cookie;
};
export const createServerAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      "Accept-Language": getServerCookie("NEXT_LOCALE"),
    },
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 406) {
        const locale = getServerCookie("NEXT_LOCALE") || "en";
        redirect(`/${locale}/dashboard/settings/identity-verification`);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
