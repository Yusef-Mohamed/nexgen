"use client";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";

const Resend = () => {
  const t = useTranslations("ResetCode");
  const myAccount = JSON.parse(getCookie("user") || "{}");
  const token = getCookie("token");
  const [isLoading, setIsLoading] = useState(false);
  const handelNotActive = async () => {
    const axiosInstance = createClientAxiosInstance();
    try {
      setIsLoading(true);
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
      setIsLoading(false);
      toast.success(t("resend_email_success"));
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.error(t("something_went_wrong"));
    }
  };
  return (
    <div className="mt-4 text-sm text-center">
      {t("no_email_received")}
      <button
        disabled={isLoading}
        onClick={handelNotActive}
        className="px-2 underline text-primary disabled:opacity-50 "
      >
        {t("resend_email")}
      </button>
    </div>
  );
};

export default Resend;
