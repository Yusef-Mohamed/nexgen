"use client";

import { createClientAxiosInstance } from "@/app/lib/utils";
import { usePathname, useRouter } from "@/i18n/routing";
import { getCookie, setCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function RefreshDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getCookie("token");
  const myAccount = JSON.parse(getCookie("user") || "{}");
  const router = useRouter();
  const pathname = usePathname();
  const text = useTranslations("common");
  const handelNotActive = async () => {
    try {
      if (pathname === "/email-verification") return;
      const axiosInstance = createClientAxiosInstance();
      await axiosInstance.post(
        "auth/resendEmailCode",
        {
          email: myAccount.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/email-verification");
      toast.success(text("please_verify_your_email"));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (token) {
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
          router.refresh();
          if (res.data.data.emailVerified === false) {
            handelNotActive();
          }
        })
        .catch((err) => {
          if (err.response.status === 401) handelNotActive();
        });
    }
  }, [token]);
  return children;
}
export default RefreshDataProvider;
