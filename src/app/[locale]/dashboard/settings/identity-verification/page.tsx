
import IdentityVerification from "../components/IdentityVerification";

const IdentityVerificationPage = async (
  props: {
    params: Promise<{ locale: string }>;
  }
) => {
  const params = await props.params;

  const {
    locale
  } = params;

  
  return <IdentityVerification />;
};

export default IdentityVerificationPage;
