"use client";

import { createClientAxiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useRef, DragEvent } from "react";
import { toast } from "react-toastify";
import { FaCloudArrowUp } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { FaImage } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";

const IdentityVerification = () => {
  const { token, user } = useAuth();
  const router = useRouter();
  const text = useTranslations("settings");
  const common = useTranslations("common");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<{
    frontImage: File | null;
    backImage: File | null;
    selfieImage: File | null;
  }>({
    frontImage: null,
    backImage: null,
    selfieImage: null,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const locale = useLocale();
  const getCurrentImageKey = () => {
    switch (currentStep) {
      case 1:
        return "frontImage";
      case 2:
        return "backImage";
      case 3:
        return "selfieImage";
      default:
        return "frontImage";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (!isLoading) {
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith("image/")) {
        handleFileSelect(files[0]);
      }
    }
  };

  const handleFileSelect = (file: File) => {
    const imageKey = getCurrentImageKey();
    setData((prev) => ({
      ...prev,
      [imageKey]: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep === 1 && data.frontImage) {
      setCurrentStep(2);
    } else if (currentStep === 2 && data.backImage) {
      setCurrentStep(3);
    } else if (currentStep === 3 && data.selfieImage) {
      try {
        setIsLoading(true);
        const axiosInstance = createClientAxiosInstance();
        const formData = new FormData();
        formData.append("idDocuments", data.frontImage as Blob);
        formData.append("idDocuments", data.backImage as Blob);
        formData.append("idDocuments", data.selfieImage as Blob);
        await axiosInstance.post(`/users/idDocument/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(text("verificationSubmitted"));
        router.refresh();
        setIsSubmitted(true);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const currentImage = data[getCurrentImageKey()];
  if (user?.idVerification === "verified") {
    return (
      <div>
        <h2 className="mt-6 mb-2 text-center">{text("verificationDone")}</h2>
        <p className="mb-8 text-center text-text-2">
          {text("verificationDoneP")}
        </p>
      </div>
    );
  }
  return (
    <div>
      {isSubmitted || user?.idVerification === "pending" ? (
        <>
          <h2 className="mt-6 mb-2 text-center">
            {text("verificationSubmitted")}
          </h2>
          <p className="mb-8 text-center text-text-2">
            {text("verificationSubmittedP")}
          </p>
        </>
      ) : (
        <>
          {currentStep === 1 && user?.idVerification === "rejected" && (
            <p>
              {text("verificationRejectedAndOurNoteIs")}
              <b>{user.note}</b>
              <br />
              {text("pleaseReSendItAgain")}
            </p>
          )}
          <Image
            src={`/images/${currentStep !== 3 ? "id-label" : "selfie"}.png`}
            alt="feedback"
            className="object-cover mx-auto rounded-xl"
            width={220}
            height={220}
          />
          <h2 className="mt-6 mb-2 text-center">
            {text(`verification${currentStep}H`)}
          </h2>
          <p className="mb-8 text-center text-text-2">
            {text(`verification${currentStep}P`)}
          </p>
          <div
            className={cn(
              `relative mx-auto h-[220px] w-full aspect-video rounded-3xl overflow-hidden`,
              {
                "cursor-not-allowed opacity-60": isLoading,
                "cursor-pointer": !isLoading,
                "border-2 border-dashed border-primary bg-primary/10":
                  isDragging || currentImage,
                "border-2 border-dashed": !isDragging,
              }
            )}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-input/20">
              <FaCloudArrowUp className="w-12 h-12 mb-2 text-primary" />
              <p className="text-sm">{text("clickOrDragImageToUpload")}</p>
              <p className="mt-1 text-xs text-text-3">
                {text("acceptedFormats")} <b>.png, .jpg, .jpeg</b>
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png, .jpg, .jpeg"
              className="hidden"
              disabled={isLoading}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />
          </div>
          <ul className="my-4 space-y-2">
            {Object.keys(data).map((key) => {
              const file = data[key as keyof typeof data];
              return file ? (
                <li
                  key={key}
                  className="flex items-center gap-4 px-6 py-3 mt-2 border rounded-sm"
                >
                  <FaImage className="w-5 h-5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                </li>
              ) : null;
            })}
          </ul>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <p className="text-xs text-center text-text-2">
              {common("id_verification.description")}
            </p>
            <div className="flex items-center justify-end gap-2">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-2"
              >
                {locale === "ar" ? (
                  <>
                    أوافق علي{" "}
                    <Link
                      href={"/terms-of-services"}
                      className="underline text-primary"
                      target="_blank"
                    >
                      الشروط الخدمات
                    </Link>
                  </>
                ) : (
                  <>
                    I agree to the{" "}
                    <Link
                      href={"/terms-of-services"}
                      className="underline text-primary"
                      target="_blank"
                    >
                      Terms of Services
                    </Link>
                  </>
                )}
              </label>
              <Checkbox required id="terms" />
            </div>
            <div className="flex items-center justify-end gap-4">
              <Button
                isLoading={isLoading}
                type="submit"
                className="w-[200px] flex items-center justify-center"
                disabled={!data[getCurrentImageKey()]}
              >
                {text("next")}
              </Button>
              {currentStep !== 1 && (
                <Button
                  isLoading={isLoading}
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  type="button"
                  className="w-[200px]"
                >
                  {text("prev")}
                </Button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default IdentityVerification;
