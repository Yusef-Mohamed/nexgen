import { API_URL } from "@/constants";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { useTranslations } from "next-intl";
const GoogleAuthBtn = () => {
  const text = useTranslations("Forms");
  return (
    <Button
      className="flex items-center w-full gap-4"
      variant={"muted"}
      asChild
    >
      <a href={`${API_URL}/auth/google`}>
        <FcGoogle />
        {text("continueWithGoogle")}
      </a>
    </Button>
  );
};

export default GoogleAuthBtn;
