"use client";

import { createClientAxiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const { token, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const text = useTranslations("Forms");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (data.newPassword !== data.confirmPassword) {
      toast.error(text("passwords_dont_match"));
      return;
    }

    if (data.newPassword.length < 6) {
      toast.error(text("password_too_short"));
      return;
    }

    setIsLoading(true);
    try {
      const axiosInstance = await createClientAxiosInstance();
      const res = await axiosInstance.put(
        `/users/changeMyPassword`,
        {
          currentPassword: data.currentPassword,
          password: data.newPassword,
          passwordConfirm: data.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const user = res.data.data;
      const newToken = res.data.token;
      updateUser({
        token: newToken,
        userData: user,
      });
      toast.success(text("password_updated"));
      setData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log("error", error);
      toast.error(text("change_password_failed"));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">{text("currentPassword")} :</Label>
          <Input
            id="currentPassword"
            type="password"
            disabled={isLoading}
            value={data.currentPassword}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">{text("newPassword")} :</Label>
          <Input
            id="newPassword"
            type="password"
            disabled={isLoading}
            value={data.newPassword}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{text("passwordConfirm")} :</Label>
          <Input
            id="confirmPassword"
            type="password"
            disabled={isLoading}
            value={data.confirmPassword}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />
        </div>

        <Button className="ms-auto w-fit" isLoading={isLoading}>
          {text("changePassword")}
        </Button>
      </div>
    </form>
  );
};

export default ChangePassword;
