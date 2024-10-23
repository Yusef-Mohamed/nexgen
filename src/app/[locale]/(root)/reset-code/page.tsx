import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import VerificationCodeForm from "@/components/Forms/VerificationCodeForm";
import AuthPage from "@/components/AuthPage";
import { getMetadataResetCodePage } from "@/getMetaData";
import { Metadata } from "next";
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
  return (
    <AuthPage heading={t("heading")} description={t("paragraph")}>
      <VerificationCodeForm />
    </AuthPage>
  );
};

export default ResetCode;
