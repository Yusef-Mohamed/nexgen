"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserAvatar from "@/components/UserAvatar";

interface IPurchasedUser {
  id: string;
  name: string;
  email: string;
  purchasedate: string;
  isresale: boolean;
  profileimage: string;
}

interface PurchasedUsersListProps {
  selectedCourseId: string;
  token: string | null;
  userCreatedAt: string | undefined;
}

// Format date to DD/MM/YYYY
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Mock API response function
const fetchMockUsers = async (
  id: string,
  type: string,
  startDate: string,
  endDate: string
): Promise<IPurchasedUser[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  // Generate mock data
  const mockUsers: IPurchasedUser[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      purchasedate: formatDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
      isresale: false,
      profileimage: "/images/default-avatar.png",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      purchasedate: formatDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
      isresale: true,
      profileimage: "/images/default-avatar.png",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      purchasedate: formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
      isresale: false,
      profileimage: "/images/default-avatar.png",
    },
    {
      id: "4",
      name: "Alice Williams",
      email: "alice.williams@example.com",
      purchasedate: formatDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)),
      isresale: true,
      profileimage: "/images/default-avatar.png",
    },
    {
      id: "5",
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      purchasedate: formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
      isresale: false,
      profileimage: "/images/default-avatar.png",
    },
  ];

  return mockUsers;
};

const PurchasedUsersList: React.FC<PurchasedUsersListProps> = ({
  selectedCourseId,
  token,
  userCreatedAt,
}) => {
  const [users, setUsers] = useState<IPurchasedUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

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

        // Use userCreatedAt as startDate (or current date if unavailable)
        const startDate = userCreatedAt
          ? formatDate(new Date(userCreatedAt))
          : formatDate(new Date());

        // Use current date as endDate
        const endDate = formatDate(new Date());

        // Map types for API
        const typeMap: Record<string, string> = {
          course: "course",
          coursePackage: "coursePackage",
          package: "package",
        };

        const apiType = typeMap[type] || "course";

        // Simulate API call with mock data
        // In real implementation: `/instructorProfits/users/${id}?startDate=${startDate}&endDate=${endDate}&type=${apiType}`
        const fetchedUsers = await fetchMockUsers(
          id,
          apiType,
          startDate,
          endDate
        );
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [selectedCourseId, token, userCreatedAt]);

  if (selectedCourseId === "all") {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 text-xl font-semibold">Purchased Users</h3>
        {isLoadingUsers ? (
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
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">No users found</p>
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
                {users.map((user) => (
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

export default PurchasedUsersList;
