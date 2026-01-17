import { use } from "react";
import { useTranslations } from "next-intl";

import SignUpForm from "@/components/Forms/SignUpForm";
import AuthPage from "@/components/AuthPage";
import { getMetadataSignUpPage } from "@/getMetaData";
import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataSignUpPage({
    params,
  });
}
const SignUpPage = (props: { params: Promise<{ locale: string }> }) => {
  const params = use(props.params);

  const {
    locale
  } = params;

  

  const t = useTranslations("SignUp");
  return (
    <AuthPage heading={t("heading")} description={t("paragraph")}>
      <SignUpForm />
      <div className="space-y-4">
        <div className="mt-4 text-sm text-center">
          {t("fall_back_paragraph")}
          <Link href="/sign-in" className="px-2 underline text-primary">
            {t("fall_back_label")}
          </Link>
        </div>
      </div>
    </AuthPage>
  );
};

export default SignUpPage;
