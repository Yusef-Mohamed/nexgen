import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import SignUpForm from "@/components/Forms/SignUpForm";
import AuthPage from "@/components/AuthPage";
import { getMetadataSignUpPage } from "@/getMetaData";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataSignUpPage({
    params,
  });
}
const SignUpPage = ({ params: { locale } }: { params: { locale: string } }) => {
  unstable_setRequestLocale(locale);

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
