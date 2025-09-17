"use client";

import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const GetDataFromToken = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { updateUser } = useAuth();
  useEffect(() => {
    if (!token) return;
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
      });
      if (user.emailVerified === false) {
        router.refresh();
        router.push("/email-verification");
        return;
      } else router.push("/");
    };
    getToken();
  }, [updateUser, token, router]);
  return <FaSpinner className="text-6xl text-primary animate-spin" />;
};

export default GetDataFromToken;
