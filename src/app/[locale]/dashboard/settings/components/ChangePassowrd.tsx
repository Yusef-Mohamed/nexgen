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

  const validatePassword = (password: string) => {
    const errors = [];

    if (password.length < 8) {
      errors.push(text("passwordTooShort"));
    }
    if (!/[A-Z]/.test(password)) {
      errors.push(text("passwordRequiresUppercase"));
    }
    if (!/[a-z]/.test(password)) {
      errors.push(text("passwordRequiresLowercase"));
    }
    if (!/[0-9]/.test(password)) {
      errors.push(text("passwordRequiresNumber"));
    }
    if (!/[@#_]/.test(password)) {
      errors.push(text("passwordRequiresSpecialChar"));
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (data.newPassword !== data.confirmPassword) {
      toast.error(text("passwords_dont_match"));
      return;
    }

    const passwordErrors = validatePassword(data.newPassword);
    if (passwordErrors.length > 0) {
      passwordErrors.forEach((error) => toast.error(error));
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
