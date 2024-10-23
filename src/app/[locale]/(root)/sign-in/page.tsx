import AuthPage from "@/components/AuthPage";
import SignInForm from "@/components/Forms/SignInForm";
import { getMetadataSignInPage } from "@/getMetaData";
import { Link } from "@/i18n/routing";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataSignInPage({
    params,
  });
}
const SignInPage = ({ params: { locale } }: { params: { locale: string } }) => {
  unstable_setRequestLocale(locale);

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
