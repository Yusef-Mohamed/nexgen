"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import * as z from "zod";
import GoogleAuthBtn from "../GoogleAuthBtn";
import { axiosInstance } from "@/app/lib/utils";
import CustomForm from "./CustomForm";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import {
  buildAuthHref,
  getAuthRedirect,
  rememberAuthRedirect,
} from "@/lib/authRedirect";

const ForgotPassword = () => {
  const t = useTranslations("SignIn");
  const inputs = useTranslations("Forms");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = getAuthRedirect(searchParams);
  const formSchema = z.object({
    email: z.string().email({ message: inputs("invalidEmail") }),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await axiosInstance.post("/auth/forgotPassword", data);
    toast.success(inputs("reset_code_sent_to_email"));
    rememberAuthRedirect(redirect);
    router.push(buildAuthHref("/reset-code", redirect));
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
