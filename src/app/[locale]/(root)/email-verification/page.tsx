import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import AuthPage from "@/components/AuthPage";
import { getMetadataResetCodePage } from "@/getMetaData";
import { Metadata } from "next";
import EmailVerificationForm from "@/components/Forms/EmailVerificationForm";
import { cookies } from "next/headers";
import { IUser } from "@/types";
import Resend from "./components/Resend";
import { DropdownMenuLogout } from "@/components/SimpleClientComponents";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataResetCodePage({
    params,
  });
}
const ResetCode = ({ params: { locale } }: { params: { locale: string } }) => {
  unstable_setRequestLocale(locale);
  const t = useTranslations("ResetCode");
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "{}") as IUser;
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
