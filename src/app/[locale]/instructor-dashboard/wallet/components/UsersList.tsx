"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import UserAvatar from "@/components/UserAvatar";
import { getDynamicString } from "@/lib/utils";
import { ICourse, ICoursePackage, IPackage, IUser } from "@/types";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { useTranslations } from "next-intl";
import { axiosInstance } from "@/app/lib/utils";

interface IPurchasedUser {
  id: string;
  name: string;
  email: string;
  purchasedate: string;
  isresale: boolean;
  profileimage: string;
}

interface UsersListProps {
  token: string | null;
  user: IUser | null;
  courses: ICourse[];
  coursePackages: ICoursePackage[];
  packages: IPackage[];
  isLoadingCourses: boolean;
}

// Format date to DD/MM/YYYY
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Parse date string (DD/MM/YYYY) to Date object
const parseDateString = (dateString: string): Date | null => {
  const parts = dateString.split("/");
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
};

// Fetch users from API
const fetchUsersFromAPI = async (
  id: string,
  type: string,
  startDate: string,
  endDate: string,
  token: string
): Promise<IPurchasedUser[]> => {
  try {
    const response = await axiosInstance.get(
      `/instructorProfits/courseAnalytics/${id}?startDate=${startDate}&endDate=${endDate}&type=${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Map API response to IPurchasedUser format
    const responseData = response.data;
    console.log(responseData);
    const users = responseData.registeredUsers || [];

    // Get the purchase date from filters (or use current date as fallback)
    const purchaseDate =
      responseData.filters?.startDate || formatDate(new Date());

    return users.map(
      (user: {
        _id?: string;
        name?: string;
        email?: string;
        isResale?: boolean;
      }) => ({
        id: user._id || "",
        name: user.name || "",
        email: user.email || "",
        purchasedate: purchaseDate,
        isresale: user.isResale || false,
        profileimage: "/images/default-avatar.png",
      })
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const UsersList: React.FC<UsersListProps> = ({
  token,
  user,
  courses,
  coursePackages,
  packages,
  isLoadingCourses,
}) => {
  const t = useTranslations("teamManagement");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [users, setUsers] = useState<IPurchasedUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [resaleFilter, setResaleFilter] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  // Auto-select first course when courses are loaded
  useEffect(() => {
    if (selectedCourseId === "all" && courses.length > 0 && !isLoadingCourses) {
      setSelectedCourseId(`course:${courses[0]._id}`);
    }
  }, [courses, isLoadingCourses, selectedCourseId]);

  // Fetch users effect
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token || selectedCourseId === "all") {
        setUsers([]);
        return;
      }

      try {
        setIsLoadingUsers(true);

        // Parse type and id from selectedCourseId (format: "type:id")
        const [type, id] = selectedCourseId.split(":");
        if (!id) {
          setUsers([]);
          return;
        }

        // Use user.createdAt as startDate (or current date if unavailable)
        const startDate = user?.createdAt
          ? formatDate(new Date(user.createdAt))
          : formatDate(addDays(new Date(), 1));

        // Use current date as endDate
        const endDate = formatDate(new Date());

        // Map types for API
        const typeMap: Record<string, string> = {
          course: "course",
          coursePackage: "coursePackage",
          package: "package",
        };

        const apiType = typeMap[type] || "course";

        // Fetch users from API
        const fetchedUsers = await fetchUsersFromAPI(
          id,
          apiType,
          startDate,
          endDate,
          token
        );
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (token && user) {
      fetchUsers();
    }
  }, [selectedCourseId, token, user]);

  // Filter users based on date and resale filters
  const filteredUsers = useMemo(() => {
    let filtered: IPurchasedUser[] = [...users];

    // Apply resale filter
    if (resaleFilter) {
      filtered = filtered.filter((user) => user.isresale);
    }

    // Apply date filter
    if (date?.from && date?.to) {
      filtered = filtered.filter((user) => {
        const purchaseDate = parseDateString(user.purchasedate);
        if (!purchaseDate) return false;
        // Reset time to midnight for proper comparison
        const fromDate = new Date(date.from!);
        fromDate.setHours(0, 0, 0, 0);
        const toDate = new Date(date.to!);
        toDate.setHours(23, 59, 59, 999);
        purchaseDate.setHours(0, 0, 0, 0);
        return purchaseDate >= fromDate && purchaseDate <= toDate;
      });
    }

    return filtered;
  }, [users, resaleFilter, date]);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Purchased Users</h3>
          <Select
            value={selectedCourseId}
            onValueChange={setSelectedCourseId}
            disabled={isLoadingCourses}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {courses.map((course) => (
                <SelectItem
                  key={`course:${course._id}`}
                  value={`course:${course._id}`}
                >
                  {getDynamicString(course.title)} - course
                </SelectItem>
              ))}
              {coursePackages.map((coursePackage) => (
                <SelectItem
                  key={`coursePackage:${coursePackage._id}`}
                  value={`coursePackage:${coursePackage._id}`}
                >
                  {getDynamicString(coursePackage.title)} - coursePackage
                </SelectItem>
              ))}
              {packages.map((pkg) => (
                <SelectItem
                  key={`package:${pkg._id}`}
                  value={`package:${pkg._id}`}
                >
                  {getDynamicString(pkg.title)} - package
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCourseId !== "all" && (
          <div className="flex flex-wrap gap-4">
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
        )}

        {selectedCourseId === "all" ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">
              Select a course to view users
            </p>
          </div>
        ) : isLoadingUsers ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">
              {users.length === 0
                ? "No users found"
                : "No users match the selected filters"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Resale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          user={{
                            name: user.name,
                            profileImg: user.profileimage,
                          }}
                        />
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.purchasedate}</TableCell>
                    <TableCell>
                      {user.isresale ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersList;
