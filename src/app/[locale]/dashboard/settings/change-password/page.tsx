import { unstable_setRequestLocale } from "next-intl/server";
import ChangePassword from "../components/ChangePassowrd";

const ChangePasswordPage = ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  unstable_setRequestLocale(locale);
  return <ChangePassword />;
};

export default ChangePasswordPage;
