import { unstable_setRequestLocale } from "next-intl/server";
import SystemReview from "../components/SystemReview";

const SystemReviewPage = ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  unstable_setRequestLocale(locale);
  return <SystemReview />;
};

export default SystemReviewPage;
