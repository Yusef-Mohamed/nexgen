"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import * as z from "zod";
import GoogleAuthBtn from "../GoogleAuthBtn";
import { createClientAxiosInstance } from "@/app/lib/utils";
import CustomForm from "./CustomForm";
import { useAuth } from "../auth-provider";

const SignInForm = () => {
  const t = useTranslations("SignIn");
  const inputs = useTranslations("Forms");
  const router = useRouter();
  const formSchema = z.object({
    email: z.string().email({ message: inputs("invalidEmail") }),
    password: z.string({ message: inputs("thisFieldIsRequired") }),
  });
  const { updateUser } = useAuth();
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const axiosInstance = createClientAxiosInstance();
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
    } else router.push("/");
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
    />
  );
};

export default SignInForm;
