"use client";

import {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
  useSyncExternalStore,
} from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { IUser } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
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
import {
  buildAuthHref,
  getAuthRedirect,
  getCurrentRedirectPath,
  rememberAuthRedirect,
} from "@/lib/authRedirect";

const AuthContext = createContext<{
  user: IUser | null;
  updateUser: ({
    userData,
    token,
    refresh,
  }: {
    userData: IUser;
    token?: string;
    refresh?: boolean;
  }) => void;
  token: string;
  logout: () => void;
  setStatus: (status: number) => void;
} | null>(null);

const subscribeToClientState = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const getStoredUser = (): IUser | null => {
  const storedUser = getCookie("user");
  if (typeof storedUser !== "string") return null;

  try {
    return JSON.parse(storedUser) as IUser;
  } catch {
    return null;
  }
};

const getStoredToken = () => {
  const storedToken = getCookie("token");
  return typeof storedToken === "string" ? storedToken : "";
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authHydrated = useSyncExternalStore(
    subscribeToClientState,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [userState, setUser] = useState<null | IUser>(null);
  const [tokenState, setToken] = useState("");
  const user = userState ?? (authHydrated ? getStoredUser() : null);
  const token = tokenState || (authHydrated ? getStoredToken() : "");
  const [showIdVerificationModal, setShowIdVerificationModal] = useState(false);
  const [showCountryAlert, setShowCountryAlert] = useState(false);
  const [countryAlertDismissedState, setCountryAlertDismissed] = useState<
    boolean | null
  >(null);
  const countryAlertDismissed =
    countryAlertDismissedState ??
    (authHydrated &&
      localStorage.getItem("countryAlertDismissed") === "true");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const text = useTranslations("common");
  const router = useRouter();
  const [status, setStatus] = useState<number>();

  const handleNotActive = async (user: IUser | null, token: string) => {
    const redirect = getAuthRedirect(searchParams);
    const emailVerificationHref = buildAuthHref(
      "/email-verification",
      redirect,
    );
    try {
      if (!user?.email) return;
      if (pathname === "/email-verification") return;

      // Check if we should rate limit the resend request
      if (typeof window !== "undefined") {
        const storageKey = `lastVerificationSent-${user.email}`;
        const lastSent = localStorage.getItem(storageKey);
        const now = Date.now();
        const fifteenMinutes = 15 * 60 * 1000; // 900,000 milliseconds

        if (lastSent) {
          const timeSinceLastSent = now - parseInt(lastSent, 10);
          if (timeSinceLastSent < fifteenMinutes) {
            // Less than 15 minutes have passed, skip POST and just redirect
            router.push(emailVerificationHref);
            toast.success(text("please_verify_your_email"));
            return;
          }
        }

        // 15+ minutes have passed or no stored value, make POST request
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

        // Update localStorage with current timestamp after successful POST
        localStorage.setItem(storageKey, now.toString());
        router.push(emailVerificationHref);
        toast.success(text("please_verify_your_email"));
      } else {
        // Fallback if window is not available (shouldn't happen in client component)
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
        router.push(emailVerificationHref);
        toast.success(text("please_verify_your_email"));
      }
    } catch (err) {
      console.log(err);
      // Always redirect even if POST request fails
      router.push(emailVerificationHref);
      toast.success(text("please_verify_your_email"));
    }
  };
  const locale = useLocale();
  const updateUser = ({
    userData,
    token,
    refresh = true,
  }: {
    userData: IUser;
    token?: string;
    refresh?: boolean;
  }) => {
    setCookie("user", JSON.stringify(userData), { maxAge: 60 * 60 * 24 });
    setUser(userData);
    if (token) {
      setCookie("token", token, { maxAge: 60 * 60 * 24 });
      setToken(token);
    }
    if (userData.emailVerified === false) {
      handleNotActive(userData, token || "");
      return;
    } else if (userData.active === false) {
      router.push("/banned");
      setStatus(405);
      return;
    } else if (!userData.country && !countryAlertDismissed) {
      setShowCountryAlert(true);
    }

    if (refresh) router.refresh();
  };
  useLayoutEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      axiosInstance.defaults.headers.common["Accept-Language"] = locale;
    }
  }, [token]);
  useLayoutEffect(() => {
    const fetchUser = async () => {
      try {
        if (!authHydrated || !token) return;
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
          token: token || "",
          refresh: false,
        });
      } catch (err) {
        const typedError = err as AxiosError;
        if (
          typedError.response?.status === 401 ||
          typedError.response?.status === 407
        )
          handleNotActive(user, token || "");
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
  }, [authHydrated, token]);

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
  // Catch 405/406 from any authenticated API call (getMe skips protect middleware)
  useEffect(() => {
    const interceptorId = axiosInstance.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        const typedError = error as AxiosError;
        const responseStatus = typedError.response?.status;
        if (responseStatus === 406) {
          setShowIdVerificationModal(true);
          setStatus(406);
        } else if (responseStatus === 405) {
          setStatus(405);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosInstance.interceptors.response.eject(interceptorId);
    };
  }, []);

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
    if (!authHydrated) return;
    if (!token) {
      if (pathname.includes("dashboard") || pathname.includes("checkout")) {
        const redirectPath = getCurrentRedirectPath(pathname, searchParams);
        rememberAuthRedirect(redirectPath);
        router.push(buildAuthHref("/sign-in", redirectPath));
      }
    }
  }, [authHydrated, token, pathname, router, searchParams]);
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
