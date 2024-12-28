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
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const LinksTable = ({ links }: { links: string[] }) => {
  const t = useTranslations("teamManagement");

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
                <LinkRow link={link} index={index} key={index} />
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
const LinkRow = ({ link, index }: { link: string; index: number }) => {
  const t = useTranslations("teamManagement");
  const locale = useLocale();
  const [data, setData] = useState<{
    registeredUsersCounter: number;
    clicks: {
      month: number;
      year: number;
      count: number;
    };
  } | null>(null);
  const { user, token } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      try {
        const axiosInstance = createClientAxiosInstance();
        const res = await axiosInstance.get(
          `/marketingAnalytics/getInvitationsAnalytics/${user._id}?invitationKey=${link}`,
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
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{link}</TableCell>
      <TableCell>{data?.clicks?.count || 0}</TableCell>
      <TableCell>{data?.registeredUsersCounter}</TableCell>
      <TableCell>{data?.clicks.month}</TableCell>
      <TableCell>{data?.clicks.year}</TableCell>
      <TableCell>
        <Button
          size={"sm"}
          onClick={() => {
            const finLink = `${window.location.origin}/${locale}/sign-up?invitationKey=${link}&invitor=${user?._id}`;
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
