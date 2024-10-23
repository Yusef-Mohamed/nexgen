import { API_URL } from "@/constants";
import axios from "axios";
import { cookies } from "next/headers";
export const getServerCookie = (key: string, isObject?: boolean) => {
  const cookiesStore = cookies();
  const cookie = cookiesStore.get(key)?.value;
  if (isObject) {
    return JSON.parse(cookie || "{}");
  }
  return cookie;
};
export const createServerAxiosInstance = () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      "Accept-Language": getServerCookie("NEXT_LOCALE"),
    },
  });
};
