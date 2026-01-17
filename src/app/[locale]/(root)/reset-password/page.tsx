import { use } from "react";
import { useTranslations } from "next-intl";

import ResetPassword from "@/components/Forms/ResetPassword";
import AuthPage from "@/components/AuthPage";
import { Metadata } from "next";
import { getMetadataResetPasswordPage } from "@/getMetaData";
export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataResetPasswordPage({
    params,
  });
}
const SignInPage = (props: { params: Promise<{ locale: string }> }) => {
  const params = use(props.params);

  const {
    locale
  } = params;

  

  const t = useTranslations("ResetPassword");
  return (
    <AuthPage heading={t("heading")} description={t("paragraph")}>
      <ResetPassword />
    </AuthPage>
  );
};

export default SignInPage;
