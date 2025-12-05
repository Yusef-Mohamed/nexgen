"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { axiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { ApiError, IMarketLog } from "@/types";
import LinksTable from "./LinksTable";
import { AxiosError } from "axios";

const InvitationLinksBlock: React.FC = () => {
  const t = useTranslations("teamManagement");
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [marketLog, setMarketLog] = useState<IMarketLog | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [validationError, setValidationError] = useState<string>("");

  const fetchInvitationLinks = useCallback(async () => {
    if (!user?._id) return;

    try {
      const logRes = await axiosInstance.get<{
        marketLog: IMarketLog;
      }>(`/marketing/getMarketLog/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMarketLog(logRes.data.marketLog);
    } catch (error) {
      const typedError = error as AxiosError<{ message?: string }>;
      if (typedError.response?.data?.message) {
        toast.error(typedError.response.data.message);
      } else {
        toast.error(t("fetchError"));
      }
    }
  }, [token, user?._id, t]);

  useEffect(() => {
    if (token) fetchInvitationLinks();
  }, [token, fetchInvitationLinks]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?._id) return;

    // Validate that the invitation link only contains English letters or hyphens
    const isValidFormat = /^[a-zA-Z-]+$/.test(formData.name.trim());

    if (!formData.name.trim()) {
      setValidationError(
        t("createLink.validation.required") || "Link name is required"
      );
      return;
    }

    if (!isValidFormat) {
      setValidationError(
        t("createLink.validation.invalidFormat") ||
          "Link name can only contain English letters (a-z, A-Z) and hyphens (-)"
      );
      return;
    }

    try {
      setIsLoading(true);
      setValidationError("");

      await axiosInstance.put(
        `/marketing/modifyInvitationKeys/${user._id}`,
        {
          keys: [formData.name.trim()],
          invitationKeys: [formData.name.trim()],
          invitationKey: formData.name.trim(),
          option: "add",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(t("createLink.success"));
      setFormData({ name: "" });
      setValidationError("");
      // Refresh data after creating link
      await fetchInvitationLinks();
    } catch (error) {
      console.error("Error creating link:", error);
      const typedError = error as AxiosError<{ errors?: ApiError[] }>;
      if (typedError.response?.data?.errors) {
        typedError.response.data.errors.forEach(({ param, msg }: ApiError) => {
          if (param) toast.error(msg);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLink = useCallback(
    async (link: string) => {
      if (!user?._id) return;

      try {
        await axiosInstance.put(
          `/marketing/modifyInvitationKeys/${user._id}`,
          {
            keys: [link],
            invitationKeys: [link],
            invitationKey: link,
            option: "remove",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Refresh data after deleting link
        await fetchInvitationLinks();
      } catch (error) {
        console.error("Error deleting link:", error);
        throw error; // Re-throw to be handled by LinksTable component
      }
    },
    [user?._id, token, fetchInvitationLinks]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow English letters (a-z, A-Z) and hyphens (-)
    const sanitizedValue = value.replace(/[^a-zA-Z-]/g, "");

    setFormData({
      ...formData,
      [e.target.name]: sanitizedValue,
    });

    // Clear validation error when user starts typing valid characters
    if (validationError) {
      setValidationError("");
    }
  };

  return (
    <>
      <Card id="invites" className="mb-4 border-none">
        <CardHeader>
          <CardTitle>{t("createLink.title")}</CardTitle>
          <CardDescription>{t("createLink.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("createLink.form.linkName.label")}
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t("createLink.form.linkName.placeholder")}
                className={`w-full ${
                  validationError ? "border-destructive" : ""
                }`}
                disabled={isLoading}
              />
              {validationError && (
                <p className="text-sm text-destructive">{validationError}</p>
              )}
            </div>
            <Button isLoading={isLoading} type="submit" className="mt-4">
              {t("createLink.form.submitButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
      <LinksTable
        links={marketLog?.invitationKeys || []}
        onDelete={handleDeleteLink}
      />
    </>
  );
};

export default InvitationLinksBlock;
