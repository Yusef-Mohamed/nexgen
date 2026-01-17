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
  const redirect = searchParams.get("redirect");
  useEffect(() => {
    if (redirect) {
      toast.error(t("pleaseLoginFirstSoYouCanAccessThisPage"));
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
    if (user.emailVerified === false) {
      router.refresh();
      router.push("/email-verification");
      return;
    } else router.push(redirect || "/dashboard");
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
