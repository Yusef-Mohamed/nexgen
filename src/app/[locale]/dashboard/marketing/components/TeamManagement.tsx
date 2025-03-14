"use client";
import React, { useState, useEffect } from "react";
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
import { useLocale } from "next-intl";
import { useAuth } from "@/components/auth-provider";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { IMarketLog, IOrder, IUser } from "@/types";
import TeamTable from "./TeamTable";
import LinksTable from "./LinksTable";
import { AxiosError } from "axios";
interface User extends IUser {
  orders?: IOrder[];
}
interface TeamData {
  status: "success";
  totalRegistrations: number;
  totalSubscribers: number;
  resaleCounter: number;
  teamMembers1: User[];
  teamMembers2: User[];
}
interface UserStats {
  items: number;
  totalOrdersPrice: number;
  resale: number;
}
interface StatsCardsProps {
  resaleCounter: number;
  totalRegistrations: number;
  totalSubscribers: number;
  t: (key: string) => string;
}

interface StatCardProps {
  title: string;
  value: number;
  base?: string;
  mark?: string;
}

const TeamManagement: React.FC = () => {
  const t = useTranslations("teamManagement");
  const { token, user } = useAuth();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<TeamData>({
    status: "success",
    totalRegistrations: 0,
    totalSubscribers: 0,
    resaleCounter: 0,
    teamMembers1: [],
    teamMembers2: [],
  });
  const [marketLog, setMarketLog] = useState<IMarketLog | null>(null);

  const [formData, setFormData] = useState({
    name: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      setIsFetching(true);
      try {
        const axiosInstance = createClientAxiosInstance();
        const logRes = await axiosInstance.get<{
          marketLog: IMarketLog;
        }>(`/marketing/getMarketLog/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMarketLog(logRes.data.marketLog);
        const res = await axiosInstance.get<TeamData>(
          `/marketing/getMarketerChildren/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data);
      } catch (error) {
        const typedError = error as AxiosError<{ message?: string }>;
        if (typedError.response?.data?.message)
          toast.error(typedError.response.data.message);
        else toast.error(t("fetchError"));
      }
      setIsFetching(false);
    };

    if (token) fetchData();
  }, [token, user?._id, t]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?._id) return;

    try {
      setIsLoading(true);
      const axiosInstance = createClientAxiosInstance();
      await axiosInstance.put(
        `/marketing/modifyInvitationKeys/${user._id}`,
        {
          keys: [formData.name],
          invitationKeys: [formData.name],
          invitationKey: formData.name,
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
    } catch (error) {
      console.error("Error creating link:", error);
      toast.error(t("createLink.error"));
    } finally {
      setIsLoading(false);
    }
  };
  console.log(marketLog);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <section className="space-y-4">
      <h2 className="font-semibold">{t("affiliateMarketing")}</h2>

      {isFetching ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="w-full aspect-[1.5] bg-input animate-pulse rounded-xl" />
            <div className="w-full aspect-[1.5] bg-input animate-pulse rounded-xl" />
            <div className="w-full aspect-[1.5] bg-input animate-pulse rounded-xl" />
          </div>
          <div className="aspect-[1.7] w-full bg-input animate-pulse rounded-xl"></div>
        </>
      ) : (
        <>
          <StatsCards
            totalRegistrations={data.totalRegistrations}
            totalSubscribers={data.totalSubscribers}
            resaleCounter={data.resaleCounter}
            t={t}
          />
          <TeamTable data={data} />
        </>
      )}
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
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <Button isLoading={isLoading} type="submit" className="mt-4">
              {t("createLink.form.submitButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
      <LinksTable links={marketLog?.invitationKeys || []} />
    </section>
  );
};

const StatsCards: React.FC<StatsCardsProps> = ({
  resaleCounter,
  totalRegistrations,
  totalSubscribers,
  t,
}) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <StatCard
      title={t("totalRegistrations")}
      value={totalRegistrations}
      base={t("student")}
    />
    <StatCard
      title={t("totalSubscribers")}
      value={totalSubscribers}
      base={t("student")}
    />
    <StatCard title={t("resale")} base={t("student")} value={resaleCounter} />
  </div>
);

const StatCard: React.FC<StatCardProps> = ({ title, value, base, mark }) => {
  const locale = useLocale();
  return (
    <Card>
      <CardContent className="p-4">
        <div>
          <p className="mb-4 max-sm:text-sm text-muted-foreground">{title}</p>
          <h3 className="flex gap-1 items-end mt-1 mb-2 font-semibold h1-5">
            {mark}
            {value?.toLocaleString()}
            {base && (
              <span className="mb-1 text-sm text-text-3">
                {locale !== "ar" ? "/" : "\\"} {base}
              </span>
            )}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
};

// Translation type to ensure all required keys are present

type PurchaseFilterType = "all" | "buyers" | "non-buyers";
type ResaleFilterType = boolean;
export type {
  TeamData,
  UserStats,
  StatsCardsProps,
  StatCardProps,
  PurchaseFilterType,
  ResaleFilterType,
  User,
};

export default TeamManagement;
