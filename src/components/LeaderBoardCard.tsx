import { IUser } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FaMedal } from "react-icons/fa";
import Image from "next/image";
import UserAvatar from "./UserAvatar";
import { useLocale } from "next-intl";

const LeaderBoardCard = ({
  users,
  title,
  isLoading,
}: {
  users: IUser[];
  title: string;
  isLoading: boolean;
}) => {
  const locale = useLocale();
  return (
    <Card className="p-4">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="flex items-center gap-2 h3">
          <FaMedal className="text-xl" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <ul className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => {
              if (i > 2) return null;
              return (
                <li
                  key={i}
                  style={{
                    [locale === "ar"
                      ? "borderRight"
                      : "borderLeft"]: `4px solid ${
                      i === 0 ? "#FFED78" : i === 1 ? "#DCDFE5" : "#F0C093"
                    }`,
                  }}
                  className={`flex items-center justify-between px-6 py-2 rounded-sm`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-input animate-pulse"></div>
                    <div className="w-32 h-4 rounded-full bg-input animate-pulse"></div>
                  </div>
                  <Image
                    src={`/images/medals/${
                      i === 0 ? "gold" : i === 1 ? "silver" : "bronze"
                    }.svg`}
                    alt="avatar"
                    width={32}
                    height={32}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="space-y-2">
            {users.map((user, i) => {
              if (i > 2) return null;
              return (
                <li
                  key={user._id}
                  style={{
                    [locale === "ar"
                      ? "borderRight"
                      : "borderLeft"]: `4px solid ${
                      i === 0 ? "#FFED78" : i === 1 ? "#DCDFE5" : "#F0C093"
                    }`,
                  }}
                  className={`flex items-center justify-between px-6 py-2 rounded-sm`}
                >
                  <div className="flex items-center gap-4">
                    <UserAvatar user={user} />
                    <span>{user.name}</span>
                  </div>
                  <Image
                    src={`/images/medals/${
                      i === 0 ? "gold" : i === 1 ? "silver" : "bronze"
                    }.svg`}
                    alt="avatar"
                    width={32}
                    height={32}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
export default LeaderBoardCard;
