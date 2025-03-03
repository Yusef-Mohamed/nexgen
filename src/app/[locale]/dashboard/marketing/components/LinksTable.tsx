import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { IUser } from "@/types";
import { Button } from "@/components/ui/button";

const LinksTable = ({ links }: { links: string[] }) => {
  const t = useTranslations("teamManagement");
  const [data, setData] = useState<{
    clicksDetails?: {
      month: string;
      year: string;
      clicksDetails: {
        clicks: number;
        invitationKey: string;
      }[];
    };
    registeredUsersCounter: Record<string, IUser[]>;
  } | null>(null);
  const { user, token } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      try {
        const axiosInstance = createClientAxiosInstance();
        const res = await axiosInstance.get(
          `/marketingAnalytics/getInvitationsAnalytics/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(t("fetchError"));
      }
    };

    if (token) fetchData();
  }, [token, user?._id, t]);
  return (
    <Card className="mb-4 border-none">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <CardTitle>{t("inviteLinks")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto whitespace-nowrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{t("link")}</TableHead>
                <TableHead>{t("clicksCount")}</TableHead>
                <TableHead>{t("registerCount")}</TableHead>
                <TableHead>{t("month")}</TableHead>
                <TableHead>{t("year")}</TableHead>
                <TableHead>{t("copyTheLink")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links?.map((link, index) => (
                <LinkRow data={data} link={link} index={index} key={index} />
              ))}
              {links.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    {t("noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
const LinkRow = ({
  link,
  index,
  data,
}: {
  link: string;
  index: number;
  data: {
    clicksDetails?: {
      month: string;
      year: string;
      clicksDetails: {
        clicks: number;
        invitationKey: string;
      }[];
    };
    registeredUsersCounter: Record<string, IUser[]>;
  } | null;
}) => {
  const t = useTranslations("teamManagement");
  const locale = useLocale();
  const clicksCount = useMemo(
    () =>
      data?.clicksDetails?.clicksDetails?.find(
        (item) => item.invitationKey === link
      )?.clicks,
    [data, link]
  );
  const registerCount = useMemo(
    () => data?.registeredUsersCounter[link]?.length,
    [data, link]
  );
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{link}</TableCell>
      <TableCell>{clicksCount || 0}</TableCell>
      <TableCell>{registerCount || 0}</TableCell>
      <TableCell>{data?.clicksDetails?.month}</TableCell>
      <TableCell>{data?.clicksDetails?.year}</TableCell>
      <TableCell>
        <Button
          size={"sm"}
          onClick={() => {
            const finLink = `${window.location.origin}/${locale}/sign-up/${link}`;
            navigator.clipboard.writeText(finLink);
            toast.success(t("linkCopied"));
          }}
        >
          {t("copy")}
        </Button>
      </TableCell>
    </TableRow>
  );
};
export default LinksTable;
