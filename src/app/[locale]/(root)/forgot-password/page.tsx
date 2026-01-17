import { use } from "react";
import { useTranslations } from "next-intl";

import ForgetPasswordForm from "@/components/Forms/ForgetPasswordForm";
import AuthPage from "@/components/AuthPage";
import { Metadata } from "next";
import { getMetadataForgetPasswordPage } from "@/getMetaData";
export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataForgetPasswordPage({
    params,
  });
}
const SignInPage = (props: { params: Promise<{ locale: string }> }) => {
  const params = use(props.params);

  const {
    locale
  } = params;

  

  const t = useTranslations("ForgotPassword");
  return (
    <AuthPage heading={t("heading")} description={t("paragraph")}>
      <ForgetPasswordForm />
    </AuthPage>
  );
};

export default SignInPage;
