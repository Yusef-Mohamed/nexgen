"use client";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { useFollowingStore } from "@/stores/FollowingStore";
import { useTranslations } from "next-intl";
import { useEffect, useState, useMemo } from "react";

const FollowBtn = ({
  userId,
  sm,
  onlyText,
}: {
  userId: string;
  sm?: boolean;
  onlyText?: boolean;
}) => {
  const text = useTranslations("dashboard");
  const common = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAuth();

  const {
    followingUsers,
    fetchFollowingUsers,
    addFollowingUser,
    removeFollowingUser,
  } = useFollowingStore();

  const isFollowed = useMemo(
    () => followingUsers.some((user) => user.user === userId),
    [followingUsers, userId]
  );

  useEffect(() => {
    fetchFollowingUsers(token);
  }, [token, fetchFollowingUsers]);

  const handleFollow = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      if (!isFollowed) {
        await axiosInstance.post(
          `/users/follow/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        addFollowingUser(userId);
      } else {
        await axiosInstance.delete(`/users/follow/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        removeFollowingUser(userId);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };
  if (user?._id === userId) return null;
  if (onlyText) {
    return (
      <button
        onClick={handleFollow}
        className="text-primary text-xs font-semibold"
        disabled={isLoading}
      >
        {isLoading
          ? common("loading")
          : isFollowed
          ? text("unfollow")
          : text("follow")}
      </button>
    );
  }
  if (sm)
    return (
      <Button
        onClick={handleFollow}
        isLoading={isLoading}
        variant={isFollowed ? "outline" : "default"}
        className="rounded"
        size={"sm"}
      >
        {isFollowed ? text("unfollow") : text("follow")}
      </Button>
    );
  return (
    <Button
      onClick={handleFollow}
      isLoading={isLoading}
      variant={isFollowed ? "outline" : "default"}
      className="rounded-full min-w-32 w-fit"
    >
      {isFollowed ? text("unfollow") : text("follow")}
    </Button>
  );
};

export default FollowBtn;
