"use client";

import { createClientAxiosInstance } from "@/app/lib/utils";
import { useRouter } from "@/i18n/routing";
import { setCookie } from "cookies-next";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const GetDataFromToken = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  useEffect(() => {
    if (!token) return;
    const axiosInstance = createClientAxiosInstance();
    axiosInstance
      .get("users/getMe", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCookie("user", JSON.stringify(res.data.data), {
          maxAge: 60 * 60 * 24,
        });
        setCookie("token", token, { maxAge: 60 * 60 * 24 });
        router.push("/");
        router.refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return <FaSpinner className="text-6xl text-primary animate-spin" />;
};

export default GetDataFromToken;
