import { use } from "react";
import { useTranslations } from "next-intl";

import VerificationCodeForm from "@/components/Forms/VerificationCodeForm";
import AuthPage from "@/components/AuthPage";
import { getMetadataResetCodePage } from "@/getMetaData";
import { Metadata } from "next";
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
const ResetCode = (props: { params: Promise<{ locale: string }> }) => {
  const params = use(props.params);

  const {
    locale
  } = params;

  

  const t = useTranslations("ResetCode");
  return (
    <AuthPage heading={t("heading")} description={t("paragraph")}>
      <VerificationCodeForm />
    </AuthPage>
  );
};

export default ResetCode;
