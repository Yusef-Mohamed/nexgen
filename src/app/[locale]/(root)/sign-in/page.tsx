import { use } from "react";
import AuthPage from "@/components/AuthPage";
import SignInForm from "@/components/Forms/SignInForm";
import { getMetadataSignInPage } from "@/getMetaData";
import { Link } from "@/i18n/navigation";
import { Metadata } from "next";
import { useTranslations } from "next-intl";

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataSignInPage({
    params,
  });
}
const SignInPage = (props: { params: Promise<{ locale: string }> }) => {
  const params = use(props.params);

  const {
    locale
  } = params;

  

  const t = useTranslations("SignIn");
  return (
    <AuthPage heading={t("heading")} description={t("paragraph")}>
      <SignInForm />
      <div className="space-y-4 ">
        <div className="mt-4 text-sm text-center">
          {t("fall_back_paragraph")}
          <Link href="/sign-up" className="px-2 underline text-primary">
            {t("fall_back_label")}
          </Link>
        </div>
        <div className="mt-4 text-sm text-center">
          {t("forgot_password")}
          <Link href="/forgot-password" className="px-2 underline text-primary">
            {t("reset_password")}
          </Link>
        </div>
      </div>
    </AuthPage>
  );
};

export default SignInPage;
