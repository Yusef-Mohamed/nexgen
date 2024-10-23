"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import * as z from "zod";
import { createClientAxiosInstance } from "@/app/lib/utils";
import CustomForm from "./CustomForm";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const t = useTranslations("SignIn");
  const inputs = useTranslations("Forms");
  const router = useRouter();
  const formSchema = z.object({
    email: z.string().email({ message: inputs("invalidEmail") }),
    newPassword: z.string({ message: inputs("thisFieldIsRequired") }),
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const axiosInstance = createClientAxiosInstance();

    await axiosInstance.put("/auth/resetPassword", data);
    router.push("/sign-in");
    toast.success(inputs("password_reset_success_please_login"));
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
    {
      type: "password",
      label: inputs("newPassword"),
      placeholder: inputs("newPassword"),
      name: "newPassword" as const,
      required: true,
    },
  ];

  return (
    <CustomForm
      schema={formSchema}
      fields={fields}
      submitLabel={t("heading")}
      onSubmit={onSubmit}
    />
  );
};

export default ResetPassword;
