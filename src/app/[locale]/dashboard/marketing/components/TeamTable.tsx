import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { TeamData, User, UserStats } from "./TeamManagement";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import UserAvatar from "@/components/UserAvatar";
import OrdersDialog from "./OrdersDialog";
import { format } from "date-fns";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
const formatDate = (date: Date) => {
  return format(date, "yyyy MM dd").split(" ").join("-");
};
const TeamTable = ({ data }: { data: TeamData }) => {
  const t = useTranslations("teamManagement");
  const [purchaseFilter, setPurchaseFilter] = useState<
    "all" | "buyers" | "non-buyers"
  >("all");
  const [resaleFilter, setResaleFilter] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [isShowAll, setIsShowAll] = useState<boolean>(false);
  const filteredUsers = useMemo(() => {
    let filteredUsers: User[] = [];
    if (purchaseFilter === "buyers") {
      filteredUsers = data.teamMembers1;
    } else if (purchaseFilter === "non-buyers") {
      filteredUsers = data.teamMembers2;
    } else {
      filteredUsers = [...data.teamMembers1, ...data.teamMembers2];
    }
    if (resaleFilter) {
      filteredUsers = filteredUsers.filter((member) =>
        member.orders?.some((order) => order.isResale)
      );
    }
    if (date?.from && date?.to) {
      filteredUsers = filteredUsers.filter((member) => {
        const createdAt = new Date(member.createdAt);
        return createdAt >= date.from! && createdAt <= date.to!;
      });
    }
    return filteredUsers;
  }, [
    data.teamMembers1,
    data.teamMembers2,
    purchaseFilter,
    resaleFilter,
    date,
  ]);
  return (
    <Card className="mb-4 border-none">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <CardTitle>{t("myTeamMembers")}</CardTitle>
        <div className="flex flex-wrap gap-4">
          <Select
            value={purchaseFilter}
            onValueChange={(value: "all" | "buyers" | "non-buyers") =>
              setPurchaseFilter(value)
            }
          >
            <SelectTrigger className="w-40 h-10 md:w-48 lg:h-12 md:h-10 md:text-sm">
              <SelectValue placeholder={t("filterByPurchase")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allUsers")}</SelectItem>
              <SelectItem value="buyers">{t("buyersOnly")}</SelectItem>
              <SelectItem value="non-buyers">{t("nonBuyersOnly")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={resaleFilter.toString()}
            onValueChange={(value) => setResaleFilter(value === "true")}
          >
            <SelectTrigger className="w-40 h-10 md:w-48 lg:h-12 md:h-10 md:text-sm">
              <SelectValue placeholder={t("resaleFilter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">{t("allOrders")}</SelectItem>
              <SelectItem value="true">{t("resaleOrdersOnly")}</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-x-auto whitespace-nowrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("items")}</TableHead>
                <TableHead>{t("totalOrdersPrice")}</TableHead>
                <TableHead>{t("resaleCount")}</TableHead>
                <TableHead>{t("registeredDate")}</TableHead>
                <TableHead>{t("orders")}</TableHead>
                <TableHead>{t("hisAnalytics")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers
                .slice(0, isShowAll ? filteredUsers.length : 3)
                ?.map((member, index) => (
                  <UserRow member={member} index={index} key={member._id} />
                ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    {t("noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setIsShowAll((prev) => !prev)}
              variant={"outline"}
            >
              {isShowAll ? t("showLess") : t("showAll")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
const UserRow = ({ member, index }: { member: User; index: number }) => {
  const t = useTranslations("teamManagement");
  const stats = useMemo((): UserStats => {
    if (!member?.orders) return { items: 0, totalOrdersPrice: 0, resale: 0 };

    return {
      items: member.orders.length,
      totalOrdersPrice: member.orders.reduce(
        (sum, order) => sum + order.totalOrderPrice,
        0
      ),
      resale: member.orders.filter((order) => order.isResale).length,
    };
  }, [member]);

  return (
    <TableRow key={member._id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <Link
          target="_blank"
          href={`/dashboard/community/profile/${member._id}`}
          className="flex items-center gap-2"
        >
          <UserAvatar
            user={{
              name: member.name,
              profileImg: member.profileImg,
            }}
          />
          <div>
            <p className="font-semibold">{member.name}</p>
            <p className="text-muted-foreground">{member.email}</p>
          </div>
        </Link>
      </TableCell>
      <TableCell>{stats.items}</TableCell>
      <TableCell>${stats.totalOrdersPrice.toLocaleString()}</TableCell>
      <TableCell>{stats.resale}</TableCell>
      <TableCell>{formatDate(new Date(member.createdAt))}</TableCell>
      <TableCell>
        <OrdersDialog orders={member.orders || []} />
      </TableCell>
      <TableCell>
        <Link
          target="_blank"
          href={`/dashboard/analytics?selectedUser=${member._id}`}
          className="underline text-primary"
        >
          {t("showHisAnalytics")}
        </Link>
      </TableCell>
    </TableRow>
  );
};
export default TeamTable;
