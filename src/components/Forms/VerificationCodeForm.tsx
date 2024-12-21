"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import * as z from "zod";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import CustomForm from "./CustomForm";

const VerificationCodeForm = () => {
  const t = useTranslations("ResetCode");
  const inputs = useTranslations("Forms");
  const router = useRouter();

  const formSchema = z.object({
    otp: z.string().min(6, {
      message: inputs("otpMustBe6Digits"),
    }),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const axiosInstance = createClientAxiosInstance();
    await axiosInstance.post("/auth/verifyResetCode", {
      resetCode: data.otp,
    });
    router.push("/reset-password");
    toast.success(inputs("code_verified"));
  };

  const fields = [
    {
      type: "otp",
      label: inputs("code"),
      placeholder: inputs("code"),
      name: "otp" as const,
      required: true,
    },
  ];

  return (
    <CustomForm
      schema={formSchema}
      fields={fields}
      submitLabel={t("checkCode")}
      onSubmit={onSubmit}
    />
  );
};

export default VerificationCodeForm;
