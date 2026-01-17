
import SystemReview from "../components/SystemReview";

const SystemReviewPage = async (
  props: {
    params: Promise<{ locale: string }>;
  }
) => {
  const params = await props.params;

  const {
    locale
  } = params;

  
  return <SystemReview />;
};

export default SystemReviewPage;
