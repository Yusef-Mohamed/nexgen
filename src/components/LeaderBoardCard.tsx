import { IUser } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FaMedal } from "react-icons/fa";
import UserAvatar from "./UserAvatar";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const medalClassName = (index: number) =>
  cn(
    "text-2xl",
    index === 0
      ? "text-primary"
      : index === 1
        ? "text-secondary"
        : "text-primary/60",
  );

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
    <Card className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-4 shadow-sm">
      <CardHeader className="mb-4 p-0">
        <CardTitle className="flex items-center gap-2 text-base font-black text-text-1">
          <FaMedal className="text-xl" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 shadow-none border-none">
        {isLoading ? (
          <ul className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => {
              if (i > 2) return null;
              return (
                <li
                  key={i}
                  style={{
                    [locale === "ar" ? "borderRight" : "borderLeft"]:
                      `4px solid ${
                        i === 0
                          ? "hsl(var(--primary))"
                          : i === 1
                            ? "hsl(var(--secondary))"
                            : "hsl(var(--primary) / 0.45)"
                      }`,
                  }}
                  className="flex items-center justify-between rounded-xl bg-background-2 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-input animate-pulse"></div>
                    <div className="w-32 h-4 rounded-full bg-input animate-pulse"></div>
                  </div>
                  <FaMedal className={medalClassName(i)} />
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
                    [locale === "ar" ? "borderRight" : "borderLeft"]:
                      `4px solid ${
                        i === 0
                          ? "hsl(var(--primary))"
                          : i === 1
                            ? "hsl(var(--secondary))"
                            : "hsl(var(--primary) / 0.45)"
                      }`,
                  }}
                  className="flex items-center justify-between rounded-xl bg-background-2 px-4 py-3"
                >
                  <Link
                    href={`/dashboard/community/profile/${user._id}`}
                    target="_blank"
                    className="flex min-w-0 items-center gap-3"
                  >
                    <UserAvatar user={user} />
                    <span className="truncate text-sm font-bold text-text-1">
                      {user.name}
                    </span>
                  </Link>
                  <FaMedal className={medalClassName(i)} />
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
