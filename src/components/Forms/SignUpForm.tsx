"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import * as z from "zod";
import GoogleAuthBtn from "../GoogleAuthBtn";
import { axiosInstance } from "@/app/lib/utils";
import CustomForm from "./CustomForm";
import { useAuth } from "../auth-provider";
import { useEffect } from "react";
import { countries } from "@/data/countries";
import { useLocale } from "next-intl";

const SignUpForm = ({ inviteKey }: { inviteKey?: string }) => {
  const t = useTranslations("SignUp");
  const inputs = useTranslations("Forms");
  const router = useRouter();
  const locale = useLocale();
  const formSchema = z
    .object({
      name: z.string({ message: inputs("thisFieldIsRequired") }),
      email: z.string().email({ message: inputs("invalidEmail") }),
      phone: z
        .string({ message: inputs("thisFieldIsRequired") })
        .min(8, { message: inputs("phoneTooShort") }),
      country: z.string({ message: inputs("thisFieldIsRequired") }),
      password: z
        .string({ message: inputs("thisFieldIsRequired") })
        .min(8, { message: inputs("passwordTooShort") })
        .regex(/[A-Z]/, { message: inputs("passwordRequiresUppercase") })
        .regex(/[a-z]/, { message: inputs("passwordRequiresLowercase") })
        .regex(/[0-9]/, { message: inputs("passwordRequiresNumber") })
        .regex(/[@#_]/, { message: inputs("passwordRequiresSpecialChar") }),
      passwordConfirm: z.string({ message: inputs("thisFieldIsRequired") }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: inputs("passwords_not_match"),
      path: ["passwordConfirm"],
    });
  const { updateUser } = useAuth();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
    if (inviteKey) {
      formattedData.invitationKey =
        inviteKey === "%D9%83%D9%88%D8%B1%D8%B3_%D9%85%D8%AC%D8%A7%D9%86%D9%8A"
          ? "كورس_مجاني"
          : inviteKey;
    }

    const response = await axiosInstance.post("/auth/signup", formattedData);
    const user = response.data.data;
    const token = response.data.token;
    console.log({
      user,
      token,
    });
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
      type: "phone",
      label: inputs("phone"),
      placeholder: inputs("phone"),
      name: "phone" as const,
      required: true,
    },
    {
      type: "select",
      label: inputs("country"),
      placeholder: inputs("country"),
      name: "country" as const,
      required: true,
      values: countries.map((country) => ({
        value: country.slug,
        label: country.name[locale as "ar" | "en"],
        image: `https://flagcdn.com/24x18/${country.slug}.png`,
      })),
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

  useEffect(() => {
    if (inviteKey)
      axiosInstance.put(
        `/marketingAnalytics/incrementSignUpClicks/${inviteKey}`
      );
  }, [inviteKey]);

  return (
    <CustomForm
      schema={formSchema}
      defaultValues={{
        name: "",
        email: "",
        phone: "",
        country: "",
        password: "",
        passwordConfirm: "",
      }}
      fields={fields}
      submitLabel={t("heading")}
      onSubmit={onSubmit}
      extraComponents={<GoogleAuthBtn />}
      hasTerms
    />
  );
};

export default SignUpForm;
