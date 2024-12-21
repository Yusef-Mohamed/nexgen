import { unstable_setRequestLocale } from "next-intl/server";
import Main from "./components/Main";

const ProfilePage = ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  unstable_setRequestLocale(locale);
  return <Main />;
};

export default ProfilePage;
