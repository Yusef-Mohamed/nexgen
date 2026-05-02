"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import * as z from "zod";
import { axiosInstance } from "@/app/lib/utils";
import CustomForm from "./CustomForm";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { buildAuthHref, getAuthRedirect } from "@/lib/authRedirect";

const ResetPassword = () => {
  const t = useTranslations("SignIn");
  const inputs = useTranslations("Forms");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = getAuthRedirect(searchParams);
  const formSchema = z.object({
    email: z.string().email({ message: inputs("invalidEmail") }),
    newPassword: z
      .string({ message: inputs("thisFieldIsRequired") })
      .min(8, { message: inputs("passwordTooShort") })
      .regex(/[A-Z]/, { message: inputs("passwordRequiresUppercase") })
      .regex(/[a-z]/, { message: inputs("passwordRequiresLowercase") })
      .regex(/[0-9]/, { message: inputs("passwordRequiresNumber") })
      .regex(/[@#_]/, { message: inputs("passwordRequiresSpecialChar") }),
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await axiosInstance.put("/auth/resetPassword", data);
    router.push(buildAuthHref("/sign-in", redirect));
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
