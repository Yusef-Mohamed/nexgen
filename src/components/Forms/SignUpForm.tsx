"use client";

import { useTranslations } from "next-intl";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { useRouter } from "@/i18n/routing";
import * as z from "zod";
import GoogleAuthBtn from "../GoogleAuthBtn";
import { createClientAxiosInstance } from "@/app/lib/utils";
import CustomForm from "./CustomForm";
import { useAuth } from "../auth-provider";

const SignUpForm = () => {
  const t = useTranslations("SignIn");
  const inputs = useTranslations("Forms");
  const { searchParams } = useCustomSearchParams();
  const router = useRouter();

  const formSchema = z
    .object({
      name: z.string({ message: inputs("thisFieldIsRequired") }),
      email: z.string().email({ message: inputs("invalidEmail") }),
      phone: z.string({ message: inputs("thisFieldIsRequired") }),
      country: z.string({ message: inputs("thisFieldIsRequired") }),
      password: z.string({ message: inputs("thisFieldIsRequired") }),
      passwordConfirm: z.string({ message: inputs("thisFieldIsRequired") }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: inputs("passwords_not_match"),
      path: ["passwordConfirm"],
    });
  const { updateUser } = useAuth();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const axiosInstance = createClientAxiosInstance();
    const formattedData: {
      name: string;
      email: string;
      phone: string;
      country: string;
      password: string;
      passwordConfirm: string;
      invitor?: string | null;
      invitationKey?: string | null;
    } = { ...data };

    if (searchParams.get("invitor")) {
      formattedData.invitor = searchParams.get("invitor");
      formattedData.invitationKey = searchParams.get("invitationKey");
    }

    const response = await axiosInstance.post("/auth/signup", formattedData);
    const user = response.data.data;
    const token = response.data.token;
    updateUser({
      userData: user,
      token,
    });
    router.push("/email-verification");
    router.refresh();
  };

  const fields = [
    {
      type: "text",
      label: inputs("name"),
      placeholder: inputs("name"),
      name: "name" as const,
      required: true,
    },
    {
      type: "email",
      label: inputs("email"),
      placeholder: inputs("email"),
      name: "email" as const,
      required: true,
    },
    {
      type: "text",
      label: inputs("phone"),
      placeholder: inputs("phone"),
      name: "phone" as const,
      required: true,
    },
    {
      type: "text",
      label: inputs("country"),
      placeholder: inputs("country"),
      name: "country" as const,
      required: true,
    },
    {
      type: "password",
      label: inputs("password"),
      placeholder: inputs("password"),
      name: "password" as const,
      required: true,
    },
    {
      type: "password",
      label: inputs("passwordConfirm"),
      placeholder: inputs("passwordConfirm"),
      name: "passwordConfirm" as const,
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
      hasTerms
    />
  );
};

export default SignUpForm;
