"use client";

import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa";

const GetDataFromToken = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { updateUser } = useAuth();
  const processedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!token) return;
    if (processedTokenRef.current === token) return;
    processedTokenRef.current = token;

    const getToken = async () => {
      const response = await axiosInstance.get("/auth/getMe", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data.data;
      updateUser({
        userData: user,
        token,
        refresh: false,
      });
      if (user.emailVerified === false) {
        router.replace("/email-verification");
        return;
      }
      router.replace("/");
    };
    getToken();
  }, [updateUser, token, router]);
  return <FaSpinner className="text-6xl text-primary animate-spin" />;
};

export default GetDataFromToken;
