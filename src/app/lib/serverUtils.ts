import { API_URL } from "@/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const getServerCookie = async (key: string, isObject?: boolean) => {
  const cookiesStore = await cookies();
  const cookie = cookiesStore.get(key)?.value;
  if (isObject) {
    return JSON.parse(cookie || "{}");
  }
  return cookie;
};
export const createServerAxiosInstance = async () => {
  const locale = await getServerCookie("NEXT_LOCALE");
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
        "Accept-Language": locale,
    },
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 406) {
        redirect(`/${locale}/dashboard/settings/identity-verification`);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
