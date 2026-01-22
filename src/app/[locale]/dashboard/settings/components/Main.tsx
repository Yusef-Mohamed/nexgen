"use client";

import { axiosInstance } from "@/app/lib/utils";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PhoneInput } from "@/components/ui/phone-input";
import { CountryInput } from "@/components/ui/country-input";
import { Form } from "@/components/ui/form";

const Main = () => {
  const { user, token, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [signatureImage, setSignatureImage] = useState<File | null>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);
  const signatureImageRef = useRef<HTMLInputElement>(null);
  const text = useTranslations("Forms");
  const formSchema = z.object({
    name: z.string(),
    phone: z.string().min(8, { message: text("phoneTooShort") }),
    email: z.string().email(),
    country: z.string({ required_error: text("countryRequired") }),
    bio: z.string(),
  });
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      country: user?.country || "",
      bio: user?.bio || "",
    },
  });

  const profileImageLink = useMemo(() => {
    if (profileImage) {
      return URL.createObjectURL(profileImage);
    }
    return user?.profileImg;
  }, [profileImage, user?.profileImg]);

  const coverImageLink = useMemo(() => {
    if (coverImage) {
      return URL.createObjectURL(coverImage);
    }
    return user?.coverImg;
  }, [coverImage, user?.coverImg]);

  const signatureImageLink = useMemo(() => {
    if (signatureImage) {
      return URL.createObjectURL(signatureImage);
    }
    return user?.signatureImage;
  }, [signatureImage, user?.signatureImage]);

  const isInstructor = user?.role === "instructor" || user?.isInstructor;

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        phone: user.phone,
        email: user.email,
        country: user.country || "",
        bio: user.bio || "",
      });
    }
  }, [user, form]);

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.phone && !user?.phone) formData.append("phone", data.phone);
      if (data.country && !user?.country)
        formData.append("country", data.country);
      if (profileImage) formData.append("profileImg", profileImage);
      if (coverImage) formData.append("coverImg", coverImage);
      if (signatureImage) formData.append("signatureImage", signatureImage);
      if (data.bio) formData.append("bio", data.bio);

      const res = await axiosInstance.put(`/users/changeMyData`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newUser = res.data.data;
      toast.success(text("profile_updated"));
      updateUser({
        userData: newUser,
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative w-full overflow-hidden rounded-md h-64 bg-muted">
        <button
          onClick={() => coverImageRef.current?.click()}
          disabled={isLoading}
          className="absolute flex items-center justify-center w-8 h-8 rounded-full top-2 right-2 bg-primary text-primary-foreground"
        >
          <MdOutlinePublishedWithChanges />
        </button>
        {coverImage && (
          <button
            onClick={() => setCoverImage(null)}
            className="absolute flex items-center justify-center w-8 h-8 rounded-full top-12 right-2 bg-destructive text-destructive-foreground"
          >
            <FaRegTrashAlt />
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
            name: form.getValues("name"),
          }}
          className="block mx-auto border-4 border-clear-ground sm:w-40 sm:h-40 w-36 h-36 md:w-48 md:h-48"
        />
        <button
          onClick={() => profileImageRef.current?.click()}
          disabled={isLoading}
          className="absolute flex items-center justify-center w-8 h-8 rounded-full top-2 right-2 bg-primary text-primary-foreground"
        >
          <MdOutlinePublishedWithChanges />
        </button>
        {profileImage && (
          <button
            onClick={() => setProfileImage(null)}
            className="absolute flex items-center justify-center w-8 h-8 rounded-full top-12 right-2 bg-destructive text-destructive-foreground"
          >
            <FaRegTrashAlt />
          </button>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <input
            type="file"
            disabled={isLoading}
            ref={profileImageRef}
            className="hidden"
            onChange={(e) => {
              setProfileImage(e.target.files ? e.target.files[0] : null);
            }}
          />
          <input
            type="file"
            disabled={isLoading}
            ref={coverImageRef}
            className="hidden"
            onChange={(e) => {
              setCoverImage(e.target.files ? e.target.files[0] : null);
            }}
          />
          <input
            type="file"
            disabled={isLoading}
            ref={signatureImageRef}
            className="hidden"
            accept="image/png"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              if (file && file.type !== "image/png") {
                toast.error(text("signatureMustBePng"));
                return;
              }
              setSignatureImage(file);
            }}
          />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{text("name")} :</Label>
              <Input
                id="name"
                disabled={isLoading}
                {...form.register("name")}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{text("email")} :</Label>
              <Input
                id="email"
                disabled={isLoading}
                {...form.register("email")}
                readOnly
              />
            </div>

            <CountryInput
              input={{
                type: "select",
                label: text("country"),
                placeholder: text("selectCountry"),
                name: "country",
                required: true,
                disabled: !!user?.country,
              }}
              form={form}
              loading={isLoading}
            />

            <PhoneInput
              input={{
                type: "phone",
                label: text("phone"),
                placeholder: text("enterPhone"),
                name: "phone",
                required: true,
                defValue: user?.phone,
                disabled: !!user?.phone?.length && user?.phone?.length > 10,
              }}
              form={form}
              loading={isLoading}
            />

            <div className="space-y-2">
              <Label htmlFor="bio">{text("bio")} :</Label>
              <Input
                id="bio"
                placeholder={text("enterBio")}
                disabled={isLoading}
                {...form.register("bio")}
              />
            </div>

            {isInstructor && (
              <div className="space-y-2">
                <Label htmlFor="signatureImage">
                  {text("signatureImage")} :
                </Label>
                <p className="text-sm text-muted-foreground">
                  {text("signatureImageHint")}
                </p>
                <div className="flex items-center gap-4">
                  {signatureImageLink && (
                    <div className="relative w-32 h-20 border rounded-md overflow-hidden bg-muted">
                      <Image
                        src={signatureImageLink}
                        alt="signature"
                        className="object-contain w-full h-full"
                        width={128}
                        height={80}
                      />
                      <button
                        type="button"
                        onClick={() => setSignatureImage(null)}
                        className="absolute flex items-center justify-center w-6 h-6 rounded-full top-1 right-1 bg-destructive text-destructive-foreground"
                      >
                        <FaRegTrashAlt className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => signatureImageRef.current?.click()}
                    disabled={isLoading}
                  >
                    {signatureImageLink
                      ? text("changeSignature")
                      : text("uploadSignature")}
                  </Button>
                </div>
              </div>
            )}

            <Button
              className="ms-auto w-fit"
              isLoading={isLoading}
            >
              {text("save")}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default Main;
