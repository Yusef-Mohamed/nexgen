"use client";

import {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { IUser } from "@/types";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from "next-intl";
import { AxiosError } from "axios";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const AuthContext = createContext<{
  user: IUser | null;
  updateUser: ({
    userData,
    token,
  }: {
    userData: IUser;
    token?: string;
  }) => void;
  token: string;
  logout: () => void;
  setStatus: (status: number) => void;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<null | IUser>(
    JSON.parse(getCookie("user") || "{}")
  );
  const [token, setToken] = useState(getCookie("token"));
  const [showIdVerificationModal, setShowIdVerificationModal] = useState(false);
  const [showCountryAlert, setShowCountryAlert] = useState(false);
  const [countryAlertDismissed, setCountryAlertDismissed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("countryAlertDismissed") === "true";
    }
    return false;
  });
  const pathname = usePathname();
  const text = useTranslations("common");
  const router = useRouter();
  const [status, setStatus] = useState<number>();
  const locale = useLocale();
  useLayoutEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) return;
        const axiosInstance = createClientAxiosInstance();
        const res = await axiosInstance.get("/auth/getMe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = res?.data.data as IUser;
        if (user.lang && user.lang !== locale) {
          try {
            await axiosInstance.put(
              "/users/changeMyData",
              { lang: locale },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            user.lang = locale as "ar" | "en";
          } catch (error) {
            console.error("Failed to update user language:", error);
          }
        }

        updateUser({
          userData: user,
        });
        router.refresh();
      } catch (err) {
        const typedError = err as AxiosError;
        if (
          typedError.response?.status === 401 ||
          typedError.response?.status === 407
        )
          handleNotActive();
        if (typedError.response?.status === 406) {
          setShowIdVerificationModal(true);
          setStatus(406);
        }
        if (typedError.response?.status === 405) {
          router.push("/banned");
          setStatus(405);
        }
      }
    };
    fetchUser();
  }, []);
  const updateUser = ({
    userData,
    token,
  }: {
    userData: IUser;
    token?: string;
  }) => {
    setCookie("user", JSON.stringify(userData), { maxAge: 60 * 60 * 24 });
    setUser(userData);
    if (token) {
      setCookie("token", token, { maxAge: 60 * 60 * 24 });
      setToken(token);
    }
    if (userData.emailVerified === false) {
      handleNotActive();
    } else if (userData.active === false) {
      router.push("/banned");
      setStatus(405);
    } else if (!userData.country && !countryAlertDismissed) {
      setShowCountryAlert(true);
    }

    router.refresh();
  };

  const handleNotActive = async () => {
    try {
      if (pathname === "/email-verification") return;
      const axiosInstance = createClientAxiosInstance();
      await axiosInstance.post(
        "auth/resendEmailCode",
        {
          email: user?.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/email-verification");
      toast.success(text("please_verify_your_email"));
    } catch (err) {
      console.log(err);
    }
  };
  const logout = () => {
    router.push("/");
    setTimeout(() => {
      setUser(null);
      setToken("");
      setStatus(undefined);
      setShowIdVerificationModal(false);
      deleteCookie("user");
      deleteCookie("token");
      router.refresh();
    }, 500);
  };
  useEffect(() => {
    if (
      status === 405 &&
      !(pathname === "/banned" || pathname === "/contact")
    ) {
      router.push("/banned");
      toast.error(text("you_are_banned_can_not_use_the_platform"));
    } else if (
      status === 406 &&
      pathname !== "/dashboard/settings/identity-verification"
    ) {
      router.push("/dashboard/settings/identity-verification");
      toast.error(
        text("please_verify_your_identity_to_be_able_to_use_the_platform")
      );
    }
  }, [status, pathname]);
  useEffect(() => {
    if (!token) {
      if (pathname.includes("dashboard") || pathname.includes("checkout")) {
        router.push("/sign-in" + "?redirect=" + pathname);
      }
    }
  }, [token, pathname]);
  return (
    <AuthContext.Provider
      value={{ user, updateUser, token: token || "", logout, setStatus }}
    >
      <AlertDialog
        open={
          showIdVerificationModal &&
          pathname !== "/dashboard/settings/identity-verification"
        }
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{text("id_verification.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {text("id_verification.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Button asChild>
            <Link href={"/dashboard/settings/identity-verification"}>
              {text("id_verification.button")}
            </Link>
          </Button>{" "}
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={
          showCountryAlert &&
          pathname !== "/dashboard/settings/profile" &&
          !countryAlertDismissed
        }
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{text("profile.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {text("profile.country_required")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-4">
            <Button asChild>
              <Link href={"/dashboard/settings"}>
                {text("profile.update_button")}
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCountryAlertDismissed(true);
                localStorage.setItem("countryAlertDismissed", "true");
                setShowCountryAlert(false);
              }}
            >
              {text("profile.dismiss")}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </AuthContext.Provider>
  );
};
