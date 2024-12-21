"use client";
import { createContext, useContext, useState, useLayoutEffect } from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { usePathname, useRouter } from "@/i18n/routing";
import { IUser } from "@/types";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { AxiosError } from "axios";
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
  const pathname = usePathname();
  const text = useTranslations("common");
  const router = useRouter();
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
          handelNotActive();
        }
        router.refresh();
      } catch (err) {
        const typedError = err as AxiosError;
        if (typedError.response?.status === 401) handelNotActive();
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
      handelNotActive();
    }
    router.refresh();
  };
  const handelNotActive = async () => {
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
    setUser(null);
    setToken("");
    deleteCookie("user");
    deleteCookie("token");
    router.refresh();
    router.push("/");
  };
  return (
    <AuthContext.Provider
      value={{ user, updateUser, token: token || "", logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
