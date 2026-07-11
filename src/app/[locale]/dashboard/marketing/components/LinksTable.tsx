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
import { axiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { IUser } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import { marketingNestedBorderClassName } from "./filterStyles";

const LinksTable = ({
  links,
  onDelete,
}: {
  links: string[];
  onDelete?: (link: string) => Promise<void>;
}) => {
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
        const res = await axiosInstance.get(
          `/marketingAnalytics/getInvitationsAnalytics/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
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
    <Card className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground shadow-sm">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-primary/10 p-4 sm:p-5">
        <CardTitle>{t("inviteLinks")}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div
          className={cn(
            "relative overflow-x-auto whitespace-nowrap",
            marketingNestedBorderClassName,
          )}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{t("link")}</TableHead>
                <TableHead>{t("clicksCount")}</TableHead>
                <TableHead>{t("registerCount")}</TableHead>
                <TableHead>{t("month")}</TableHead>
                <TableHead>{t("year")}</TableHead>
                <TableHead>{t("actions") || "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links?.map((link, index) => (
                <LinkRow
                  data={data}
                  link={link}
                  index={index}
                  key={index}
                  onDelete={onDelete}
                />
              ))}
              {links.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
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
  onDelete,
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
  onDelete?: (link: string) => Promise<void>;
}) => {
  const t = useTranslations("teamManagement");
  const postActionText = useTranslations("postAction");
  const locale = useLocale();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const clicksCount = useMemo(
    () =>
      data?.clicksDetails?.clicksDetails?.find(
        (item) => item.invitationKey === link,
      )?.clicks,
    [data, link],
  );
  const registerCount = useMemo(
    () => data?.registeredUsersCounter[link]?.length,
    [data, link],
  );

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(link);
      setIsDeleteDialogOpen(false);
      toast.success(t("deleteLink.success") || "Link deleted successfully");
    } catch (error) {
      const typedError = error as AxiosError<{ message?: string }>;
      if (typedError.response?.data?.message) {
        toast.error(typedError.response.data.message);
      } else {
        toast.error(t("deleteLink.error") || "Failed to delete link");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{link}</TableCell>
        <TableCell>{clicksCount || 0}</TableCell>
        <TableCell>{registerCount || 0}</TableCell>
        <TableCell>{data?.clicksDetails?.month}</TableCell>
        <TableCell>{data?.clicksDetails?.year}</TableCell>

        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="rounded-xl"
              onClick={() => {
                const finLink = `${window.location.origin}/${locale}/sign-up/${link}`;
                navigator.clipboard.writeText(finLink);
                toast.success(t("linkCopied"));
              }}
            >
              <Copy className="me-1 size-3.5" />
              {t("copy")}
            </Button>
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                className="rounded-xl"
                aria-label={postActionText("delete")}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
      {onDelete && (
        <ConfirmationDialog
          open={isDeleteDialogOpen}
          title={postActionText("areYouSure")}
          description={t("deleteLink.confirmation")}
          isLoading={isDeleting}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};
export default LinksTable;
