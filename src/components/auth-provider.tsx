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
import { useTranslations } from "next-intl";
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
  const pathname = usePathname();
  const text = useTranslations("common");
  const router = useRouter();
  const [status, setStatus] = useState<number>();

  useLayoutEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) return;
        const axiosInstance = createClientAxiosInstance();
        const res = await axiosInstance.get("/users/getMe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = res?.data.data;
        setUser(user);
        setCookie("user", JSON.stringify(user), { maxAge: 60 * 60 * 24 });

        if (user.emailVerified === false) {
          handleNotActive();
        }
        router.refresh();
      } catch (err) {
        const typedError = err as AxiosError;
        if (typedError.response?.status === 401) handleNotActive();
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
    setUser(null);
    setToken("");
    setStatus(undefined);
    deleteCookie("user");
    deleteCookie("token");
    router.refresh();
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
  return (
    <AuthContext.Provider
      value={{ user, updateUser, token: token || "", logout }}
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
      {children}
    </AuthContext.Provider>
  );
};
