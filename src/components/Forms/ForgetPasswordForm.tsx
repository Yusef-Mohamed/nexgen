"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import * as z from "zod";
import GoogleAuthBtn from "../GoogleAuthBtn";
import { createClientAxiosInstance } from "@/app/lib/utils";
import CustomForm from "./CustomForm";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const t = useTranslations("SignIn");
  const inputs = useTranslations("Forms");
  const router = useRouter();
  const formSchema = z.object({
    email: z.string().email({ message: inputs("invalidEmail") }),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const axiosInstance = createClientAxiosInstance();
    await axiosInstance.post("/auth/forgotPassword", data);
    toast.success(inputs("reset_code_sent_to_email"));
    router.push("/reset-code");
    router.refresh();
  };

  const fields = [
    {
      type: "email",
      label: inputs("email"),
      placeholder: inputs("email"),
      name: "email" as const,
      required: true,
    },
  ];

  return (
    <CustomForm
      schema={formSchema}
      fields={fields}
      submitLabel={t("heading")}
      onSubmit={onSubmit}
      extraComponents={<GoogleAuthBtn />}
    />
  );
};

export default ForgotPassword;
