
import Main from "./components/Main";

const ProfilePage = async (
  props: {
    params: Promise<{ locale: string }>;
  }
) => {
  const params = await props.params;

  const {
    locale
  } = params;

  
  return <Main />;
};

export default ProfilePage;
