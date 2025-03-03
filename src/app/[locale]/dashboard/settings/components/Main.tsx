"use client";

import { createClientAxiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserAvatar from "@/components/UserAvatar";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { toast } from "react-toastify";

const Main = () => {
  const { user, token, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{
    name: string;
    phone: string;
    email: string;
    profileImage: null | File;
    coverImage: null | File;
    bio: string;
  }>({
    name: "",
    phone: "",
    email: "",
    profileImage: null,
    coverImage: null,
    bio: "",
  });
  const profileImageRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);
  const text = useTranslations("Forms");
  const profileImageLink = useMemo(() => {
    if (data.profileImage) {
      return URL.createObjectURL(data.profileImage);
    }
    return user?.profileImg;
  }, [data.profileImage, user?.profileImg]);
  const coverImageLink = useMemo(() => {
    if (data.coverImage) {
      return URL.createObjectURL(data.coverImage);
    }
    return user?.coverImg;
  }, [data.coverImage, user?.coverImg]);
  useEffect(() => {
    if (user) {
      setData({
        name: user.name,
        phone: user.phone,
        email: user.email,
        profileImage: null,
        coverImage: null,
        bio: user.bio || "",
      });
    }
  }, [user]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.phone) formData.append("phone", data.phone);
      if (data.profileImage) formData.append("profileImg", data.profileImage);
      if (data.coverImage) formData.append("coverImg", data.coverImage);
      if (data.bio) formData.append("bio", data.bio);
      const axiosInstance = await createClientAxiosInstance();
      const res = await axiosInstance.put(`/users/changeMyData`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = res.data.data;
      toast.success(text("profile_updated"));
      updateUser({
        userData: user,
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="relative w-full overflow-hidden rounded-md aspect-video bg-muted">
        <button
          onClick={() => coverImageRef.current?.click()}
          disabled={isLoading}
          className="absolute flex items-center justify-center w-8 h-8 rounded-full top-2 right-2 bg-primary text-primary-foreground"
        >
          <MdOutlinePublishedWithChanges />
        </button>
        {data.coverImage && (
          <button
            onClick={() => {
              setData((prev) => ({
                ...prev,
                coverImage: null,
              }));
            }}
            className="absolute flex items-center justify-center w-8 h-8 rounded-full top-12 right-2 bg-destructive text-destructive-foreground"
          >
            <FaRegTrashAlt />{" "}
          </button>
        )}

        {coverImageLink && (
          <Image
            src={coverImageLink}
            alt="cover"
            className="object-cover w-full h-full"
            width={1920}
            height={1080}
          />
        )}
      </div>
      <div className="relative mx-auto -mt-16 sm:-mt-20 md:-mt-24 w-fit">
        <UserAvatar
          user={{
            profileImg: profileImageLink,
            name: data.name,
          }}
          className="block mx-auto border-4 border-clear-ground sm:w-40 sm:h-40 w-36 h-36 md:w-48 md:h-48 "
        />
        <button
          onClick={() => profileImageRef.current?.click()}
          disabled={isLoading}
          className="absolute flex items-center justify-center w-8 h-8 rounded-full top-2 right-2 bg-primary text-primary-foreground"
        >
          <MdOutlinePublishedWithChanges />
        </button>
        {data.profileImage && (
          <button
            onClick={() => {
              setData((prev) => ({
                ...prev,
                profileImage: null,
              }));
            }}
            className="absolute flex items-center justify-center w-8 h-8 rounded-full top-12 right-2 bg-destructive text-destructive-foreground"
          >
            <FaRegTrashAlt />{" "}
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          disabled={isLoading}
          ref={profileImageRef}
          className="hidden"
          onChange={(e) => {
            setData((prev) => ({
              ...prev,
              profileImage: e.target.files ? e.target.files[0] : null,
            }));
          }}
        />
        <input
          type="file"
          disabled={isLoading}
          ref={coverImageRef}
          className="hidden"
          onChange={(e) => {
            setData((prev) => ({
              ...prev,
              coverImage: e.target.files ? e.target.files[0] : null,
            }));
          }}
        />
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{text("name")} :</Label>
            <Input id="name" disabled={isLoading} value={data.name} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{text("email")} :</Label>
            <Input
              id="email"
              value={data.email}
              readOnly
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{text("phone")} :</Label>
            <Input
              id="phone"
              placeholder={text("enterPhone")}
              value={data.phone}
              onChange={(e) =>
                setData((prev) => ({ ...prev, phone: e.target.value }))
              }
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">{text("bio")} :</Label>
            <Input
              id="bio"
              placeholder={text("enterBio")}
              value={data.bio}
              onChange={(e) =>
                setData((prev) => ({ ...prev, bio: e.target.value }))
              }
              disabled={isLoading}
            />
          </div>
          <Button className="ms-auto w-fit" isLoading={isLoading}>
            {text("save")}
          </Button>
        </div>
      </form>
    </>
  );
};

export default Main;
