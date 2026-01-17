
import ChangePassword from "../components/ChangePassowrd";

const ChangePasswordPage = async (
  props: {
    params: Promise<{ locale: string }>;
  }
) => {
  const params = await props.params;

  const {
    locale
  } = params;

  
  return <ChangePassword />;
};

export default ChangePasswordPage;
