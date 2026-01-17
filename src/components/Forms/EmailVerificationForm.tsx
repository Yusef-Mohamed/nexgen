"use client";

import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import CustomFormField from "../FormField";
import { axiosInstance } from "@/app/lib/utils";
import { AxiosError } from "axios";
const EmailVerificationForm = () => {
  const t = useTranslations("ResetCode");
  const inputs = useTranslations("Forms");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = z.object({
    otp: z.string().min(6, {
      message: inputs("otpMustBe6Digits"),
    }),
  });
  type VerificationFormValue = z.infer<typeof formSchema>;
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<VerificationFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const onSubmit = async (data: VerificationFormValue) => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/verifyEmail", {
        code: data.otp,
      });
      router.push("/");
      toast.success(inputs("your_email_have_been_verified"));
    } catch (err) {
      const typedError = err as AxiosError<{
        message?: string;
      }>;
      if (typedError.response?.data.message) {
        setFormError(typedError.response?.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          input={{
            type: "otp",
            label: inputs("code"),
            placeholder: inputs("code"),
            name: "otp",
            required: true,
          }}
          form={form}
          loading={isLoading}
        />

        {formError && (
          <div className="text-sm text-destructive">{formError}</div>
        )}
        <Button isLoading={isLoading} className="w-full" type="submit">
          {t("checkCode")}
        </Button>
      </form>
    </Form>
  );
};

export default EmailVerificationForm;
