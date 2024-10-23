import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import ResetPassword from "@/components/Forms/ResetPassword";
import AuthPage from "@/components/AuthPage";
import { Metadata } from "next";
import { getMetadataResetPasswordPage } from "@/getMetaData";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataResetPasswordPage({
    params,
  });
}
const SignInPage = ({ params: { locale } }: { params: { locale: string } }) => {
  unstable_setRequestLocale(locale);

  const t = useTranslations("ResetPassword");
  return (
    <AuthPage heading={t("heading")} description={t("paragraph")}>
      <ResetPassword />
    </AuthPage>
  );
};

export default SignInPage;
