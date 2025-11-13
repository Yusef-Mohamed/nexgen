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
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { TeamData, User, UserStats } from "./TeamManagement";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import UserAvatar from "@/components/UserAvatar";
import OrdersDialog from "./OrdersDialog";
import { format } from "date-fns";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ICourse, ICoursePackage, IPackage } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import * as XLSX from "xlsx";
import { getDynamicString } from "@/lib/utils";
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
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [coursePackages, setCoursePackages] = useState<ICoursePackage[]>([]);
  const [packages, setPackages] = useState<IPackage[]>([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/courses");
        setCourses(res.data.data);
      } catch (err) {
        console.log(err);
        setCourses([]);
      }
      try {
        const res = await axiosInstance.get("/coursePackages");
        setCoursePackages(res.data.data);
      } catch (err) {
        console.log(err);
        setCoursePackages([]);
      }
      try {
        const res = await axiosInstance.get("/packages");
        setPackages(res.data.data);
      } catch (err) {
        console.log(err);
        setPackages([]);
      }
    };
    fetchCourses();
  }, []);
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
    if (selectedItem) {
      const [type, id] = selectedItem.split("-");
      filteredUsers = filteredUsers.filter((member) => {
        return member.orders?.some((order) => {
          if (type === "course") {
            return order.course?._id === id;
          } else if (type === "coursePackage") {
            return order.coursePackage?._id === id;
          } else if (type === "package") {
            return order.package?._id === id;
          }
        });
      });
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
    selectedItem,
  ]);

  const handleExportToExcel = () => {
    const exportData = filteredUsers.map((user) => ({
      Name: user.name,
      Email: user.email,
      Phone: user.phone || "+000000000",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Team Members");
    XLSX.writeFile(wb, "team_members.xlsx");
  };

  return (
    <Card className="mb-4 border-none">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CardTitle>{t("myTeamMembers")}</CardTitle>
          <Button
            onClick={handleExportToExcel}
            variant="outline"
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t("exportToExcel")}
          </Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Select
            value={selectedItem}
            onValueChange={(value) => setSelectedItem(value)}
          >
            <SelectTrigger className="w-40 h-10 md:w-48 lg:h-12 md:h-10 md:text-sm">
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
            <p className="text-muted-foreground w-fit" dir="ltr">
              {member.phone || "+000000000"}
            </p>
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
