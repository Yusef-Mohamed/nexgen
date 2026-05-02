"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import * as z from "zod";
import GoogleAuthBtn from "../GoogleAuthBtn";
import { axiosInstance } from "@/app/lib/utils";
import CustomForm from "./CustomForm";
import { useAuth } from "../auth-provider";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  clearStoredAuthRedirect,
  getAuthRedirect,
  rememberAuthRedirect,
} from "@/lib/authRedirect";

const SignInForm = () => {
  const t = useTranslations("SignIn");
  const inputs = useTranslations("Forms");
  const router = useRouter();
  const formSchema = z.object({
    email: z.string().email({ message: inputs("invalidEmail") }),
    password: z.string({ message: inputs("thisFieldIsRequired") }),
  });
  const { updateUser } = useAuth();
  const searchParams = useSearchParams();
  const redirect = getAuthRedirect(searchParams);
  useEffect(() => {
    if (redirect) {
      rememberAuthRedirect(redirect);
    }
  }, [redirect]);
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formattedData: {
      password: string;
      email: string;
    } = { ...data };
    const response = await axiosInstance.post("/auth/login", formattedData);
    const user = response.data.data;
    const token = response.data.token;
    updateUser({
      userData: user,
      token,
    });
    router.refresh();
    if (user.emailVerified === false) {
    } else {
      router.push(redirect || "/dashboard");
      clearStoredAuthRedirect();
    }
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
      label: inputs("password"),
      placeholder: inputs("password"),
      name: "password" as const,
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
      defaultValues={{
        email: "",
        password: "",
      }}
    />
  );
};

export default SignInForm;
