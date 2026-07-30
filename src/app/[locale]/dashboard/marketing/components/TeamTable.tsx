import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { DateRange } from "react-day-picker";
import {
  BarChart3,
  CalendarDays,
  Download,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";
import * as XLSX from "xlsx";

import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  DataTableContent,
  DataTableDescription,
  DataTableEmpty,
  DataTableFooter,
  DataTableHeader,
  DataTableHeading,
  DataTableIcon,
  DataTableTitle,
  DataTableToolbar,
} from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFilterCoursePackages } from "@/hooks/useFilterCoursePackages";
import { useFilterCourses } from "@/hooks/useFilterCourses";
import { useFilterPackages } from "@/hooks/useFilterPackages";
import { Link } from "@/i18n/navigation";
import { cn, getDynamicString } from "@/lib/utils";

import { TeamData, User, UserStats } from "./TeamManagement";
import OrdersDialog from "./OrdersDialog";
import {
  marketingFilterControlClassName,
  marketingOutlineButtonClassName,
} from "./filterStyles";

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

const TeamTable = ({ data }: { data: TeamData }) => {
  const t = useTranslations("teamManagement");
  const [purchaseFilter, setPurchaseFilter] = useState<
    "all" | "buyers" | "non-buyers"
  >("all");
  const [resaleFilter, setResaleFilter] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [isShowAll, setIsShowAll] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const { courses } = useFilterCourses({ enable: true });
  const { coursePackages } = useFilterCoursePackages({ enable: true });
  const { packages } = useFilterPackages({ enable: true });

  const filteredUsers = useMemo(() => {
    let users: User[];

    if (purchaseFilter === "buyers") {
      users = data.teamMembers1;
    } else if (purchaseFilter === "non-buyers") {
      users = data.teamMembers2;
    } else {
      users = [...data.teamMembers1, ...data.teamMembers2];
    }

    if (resaleFilter) {
      users = users.filter((member) =>
        member.orders?.some((order) => order.isResale),
      );
    }

    if (selectedItem) {
      const [type, id] = selectedItem.split("-");
      users = users.filter((member) =>
        member.orders?.some((order) => {
          if (type === "course") return order.course?._id === id;
          if (type === "coursePackage") {
            return order.coursePackage?._id === id;
          }
          if (type === "package") return order.package?._id === id;
          return false;
        }),
      );
    }

    if (date?.from && date?.to) {
      users = users.filter((member) => {
        const createdAt = new Date(member.createdAt);
        return createdAt >= date.from! && createdAt <= date.to!;
      });
    }

    return users;
  }, [
    data.teamMembers1,
    data.teamMembers2,
    purchaseFilter,
    resaleFilter,
    date,
    selectedItem,
  ]);

  const visibleUsers = isShowAll ? filteredUsers : filteredUsers.slice(0, 3);

  const handleExportToExcel = () => {
    const exportData = filteredUsers.map((user) => ({
      Name: user.name,
      Email: user.email,
      Phone: user.phone || "+000000000",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Team Members");
    XLSX.writeFile(workbook, "team_members.xlsx");
  };

  return (
    <DataTable variant="striped">
      <DataTableHeader>
        <DataTableHeading>
          <DataTableIcon>
            <UsersRound aria-hidden className="size-5" />
          </DataTableIcon>
          <div className="min-w-0">
            <DataTableTitle>{t("myTeamMembers")}</DataTableTitle>
            <DataTableDescription className="tabular-nums">
              {filteredUsers.length.toLocaleString()} {t("student")}
            </DataTableDescription>
          </div>
        </DataTableHeading>
        <Button
          onClick={handleExportToExcel}
          variant="outline"
          size="sm"
          className={cn(
            "w-full gap-2 sm:w-auto",
            marketingOutlineButtonClassName,
          )}
        >
          <Download aria-hidden className="size-4" />
          {t("exportToExcel")}
        </Button>
      </DataTableHeader>

      <DataTableToolbar>
        <span className="hidden size-9 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-clear-ground text-text-3 shadow-sm lg:inline-flex">
          <SlidersHorizontal aria-hidden className="size-4" />
        </span>
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Select value={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger
              className={cn("w-full", marketingFilterControlClassName)}
            >
              <SelectValue placeholder={t("allItems")} />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course._id} value={`course-${course._id}`}>
                  {t("course")} - {getDynamicString(course.title)}
                </SelectItem>
              ))}
              {coursePackages.map((coursePackage) => (
                <SelectItem
                  key={coursePackage._id}
                  value={`coursePackage-${coursePackage._id}`}
                >
                  {t("path")} - {getDynamicString(coursePackage.title)}
                </SelectItem>
              ))}
              {packages.map((pack) => (
                <SelectItem key={pack._id} value={`package-${pack._id}`}>
                  {t("service")} - {getDynamicString(pack.title)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={purchaseFilter}
            onValueChange={(value: "all" | "buyers" | "non-buyers") =>
              setPurchaseFilter(value)
            }
          >
            <SelectTrigger
              className={cn("w-full", marketingFilterControlClassName)}
            >
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
            <SelectTrigger
              className={cn("w-full", marketingFilterControlClassName)}
            >
              <SelectValue placeholder={t("resaleFilter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">{t("allOrders")}</SelectItem>
              <SelectItem value="true">{t("resaleOrdersOnly")}</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange
            date={date}
            setDate={setDate}
            className="min-w-0"
            buttonClassName={cn(
              "w-full min-w-0",
              marketingFilterControlClassName,
            )}
          />
        </div>
      </DataTableToolbar>

      <DataTableContent>
        <Table className="min-w-[1080px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead>{t("name")}</TableHead>
              <TableHead className="text-center">{t("items")}</TableHead>
              <TableHead>{t("totalOrdersPrice")}</TableHead>
              <TableHead className="text-center">{t("resaleCount")}</TableHead>
              <TableHead>{t("registeredDate")}</TableHead>
              <TableHead>{t("orders")}</TableHead>
              <TableHead>{t("hisAnalytics")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleUsers.map((member, index) => (
              <UserRow member={member} index={index} key={member._id} />
            ))}
            {filteredUsers.length === 0 ? (
              <DataTableEmpty
                colSpan={8}
                icon={<UsersRound aria-hidden className="size-5" />}
                title={t("noResults")}
              />
            ) : null}
          </TableBody>
        </Table>
      </DataTableContent>

      {filteredUsers.length > 3 ? (
        <DataTableFooter>
          <Button
            onClick={() => setIsShowAll((current) => !current)}
            variant="outline"
            size="sm"
            className={cn("w-full sm:w-auto", marketingOutlineButtonClassName)}
          >
            {isShowAll ? t("showLess") : t("showAll")}
          </Button>
        </DataTableFooter>
      ) : null}
    </DataTable>
  );
};

const UserRow = ({ member, index }: { member: User; index: number }) => {
  const t = useTranslations("teamManagement");
  const stats = useMemo((): UserStats => {
    if (!member.orders) {
      return { items: 0, totalOrdersPrice: 0, resale: 0 };
    }
    return {
      items: member.orders.length,
      totalOrdersPrice: member.orders.reduce(
        (sum, order) => sum + order.totalOrderPrice,
        0,
      ),
      resale: member.orders.filter((order) => order.isResale).length,
    };
  }, [member.orders]);

  return (
    <TableRow className="group">
      <TableCell className="text-center">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-background-2 text-xs font-bold tabular-nums text-text-3">
          {String(index + 1).padStart(2, "0")}
        </span>
      </TableCell>
      <TableCell>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={`/dashboard/community/profile/${member._id}`}
          className="group/member flex w-fit items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <UserAvatar
            user={{ name: member.name, profileImg: member.profileImg }}
            className="ring-2 ring-primary/10 transition-shadow group-hover/member:ring-primary/25"
          />
          <div className="min-w-0">
            <p className="max-w-48 truncate font-semibold text-text-1 transition-colors group-hover/member:text-primary">
              {member.name}
            </p>
            <p className="max-w-52 truncate text-xs text-text-3">
              {member.email}
            </p>
            <p className="mt-0.5 w-fit text-xs text-text-3" dir="ltr">
              {member.phone || "+000000000"}
            </p>
          </div>
        </Link>
      </TableCell>
      <TableCell className="text-center">
        <MetricBadge>{stats.items.toLocaleString()}</MetricBadge>
      </TableCell>
      <TableCell>
        <span className="font-bold tabular-nums text-text-1">
          ${stats.totalOrdersPrice.toLocaleString()}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <MetricBadge active={stats.resale > 0}>
          {stats.resale.toLocaleString()}
        </MetricBadge>
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm tabular-nums text-text-2">
          <CalendarDays aria-hidden className="size-4 text-text-3" />
          {formatDate(new Date(member.createdAt))}
        </span>
      </TableCell>
      <TableCell>
        <OrdersDialog orders={member.orders || []} />
      </TableCell>
      <TableCell>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={`/dashboard/analytics?selectedUser=${member._id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/10 px-3 py-2 text-xs font-bold text-primary transition-colors hover:border-primary/30 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <BarChart3 aria-hidden className="size-4" />
          {t("showHisAnalytics")}
        </Link>
      </TableCell>
    </TableRow>
  );
};

const MetricBadge = ({
  active = false,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
}) => (
  <span
    className={cn(
      "inline-flex min-w-9 items-center justify-center rounded-lg px-2.5 py-1 text-xs font-bold tabular-nums",
      active ? "bg-primary/10 text-primary" : "bg-background-2 text-text-2",
    )}
  >
    {children}
  </span>
);

export default TeamTable;
