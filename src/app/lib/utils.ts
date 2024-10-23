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
