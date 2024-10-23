import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import ForgetPasswordForm from "@/components/Forms/ForgetPasswordForm";
import AuthPage from "@/components/AuthPage";
import { Metadata } from "next";
import { getMetadataForgetPasswordPage } from "@/getMetaData";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataForgetPasswordPage({
    params,
  });
}
const SignInPage = ({ params: { locale } }: { params: { locale: string } }) => {
  unstable_setRequestLocale(locale);

  const t = useTranslations("ForgotPassword");
  return (
    <AuthPage heading={t("heading")} description={t("paragraph")}>
      <ForgetPasswordForm />
    </AuthPage>
  );
};

export default SignInPage;
