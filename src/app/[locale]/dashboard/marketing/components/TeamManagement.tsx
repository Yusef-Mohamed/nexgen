"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "next-intl";
import { useAuth } from "@/components/auth-provider";
import { axiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { IOrder, IUser } from "@/types";
import TeamTable from "./TeamTable";
import InvitationLinksBlock from "./InvitationLinksBlock";
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
  const [data, setData] = useState<TeamData>({
    status: "success",
    totalRegistrations: 0,
    totalSubscribers: 0,
    resaleCounter: 0,
    teamMembers1: [],
    teamMembers2: [],
  });

  const fetchData = useCallback(async () => {
    if (!user?._id) return;

    setIsFetching(true);
    try {
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
  }, [token, user?._id, t]);

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);
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
      <InvitationLinksBlock />
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
          <h3 className="flex items-end gap-1 mt-1 mb-2 font-semibold h1-5">
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
