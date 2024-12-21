import { unstable_setRequestLocale } from "next-intl/server";
import IdentityVerification from "../components/IdentityVerification";

const IdentityVerificationPage = ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  unstable_setRequestLocale(locale);
  return <IdentityVerification />;
};

export default IdentityVerificationPage;
