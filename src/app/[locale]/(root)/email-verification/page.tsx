import { use } from "react";
import { useTranslations } from "next-intl";

import AuthPage from "@/components/AuthPage";
import { getMetadataResetCodePage } from "@/getMetaData";
import { Metadata } from "next";
import EmailVerificationForm from "@/components/Forms/EmailVerificationForm";
import { cookies } from "next/headers";
import { IUser } from "@/types";
import Resend from "./components/Resend";
import { DropdownMenuLogout } from "@/components/SimpleClientComponents";
export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataResetCodePage({
    params,
  });
}
const ResetCode = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;

  const {
    locale
  } = params;

  
  const t = useTranslations("ResetCode");
  const cookieStore = await cookies();
  const user = JSON.parse(cookieStore.get("user")?.value || "{}") as IUser;
  return (
    <AuthPage
      heading={t("heading")}
      description={t("email_verification") + user.email}
    >
      <EmailVerificationForm />
      <div className="space-y-4">
        <Resend />
        <div className="mt-4 text-sm text-center">
          {t("not_your_account")}
          <DropdownMenuLogout className="px-2 underline text-primary" />
        </div>
      </div>
    </AuthPage>
  );
};

export default ResetCode;
