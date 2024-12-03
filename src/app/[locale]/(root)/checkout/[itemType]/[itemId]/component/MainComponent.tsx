"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ICourse, ICoursePackage, IPackage } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ItemType } from "../page";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { toast } from "react-toastify";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { getCookie } from "cookies-next";
import { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const methods = [
  {
    label: "card",
    logos: ["visa.png", "master-card.svg"],
    value: "card",
  },
  {
    label: "crypto",
    logos: ["crypto.svg"],
    value: "crypto",
  },
];
const MainComponent = ({
  thisItem,
  itemType,
}: {
  thisItem: ICourse | ICoursePackage | IPackage | null;
  itemType?: ItemType;
}) => {
  const text = useTranslations("checkout");
  const [selectedMethod, setSelectedMethod] = useState<"card" | "crypto" | "">(
    ""
  );
  const [isVerified, setIsVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [needPlacementExams, setNeedPlacementExams] = useState(false);
  const handelPayment = async () => {
    const token = getCookie("token");
    if (!token) {
      toast.error(text("loginFirst"));
      return;
    }
    if (!isVerified) {
      toast.error(text("verifyRecaptcha"));
      return;
    }

    if (!selectedMethod) {
      toast.error(text("selectPaymentMethod"));
      return;
    }

    if (!thisItem) {
      toast.error(text("invalidItem"));
      return;
    }
    try {
      setIsLoading(true);
      let endpoint =
        itemType === "course"
          ? `/orders/course-checkout/${thisItem._id}`
          : itemType === "learning-path"
          ? `/orders/course-package-checkout/${thisItem._id}`
          : `/orders/package-checkout/${thisItem._id}`;
      if (selectedMethod === "card") {
        endpoint =
          itemType === "course"
            ? `/orders/lahza/courseCheckout/${thisItem._id}`
            : itemType === "learning-path"
            ? `/orders/lahza/coursePackageCheckout/${thisItem._id}`
            : `/orders/lahza/packageCheckout/${thisItem._id}`;
      }
      const axiosInstance = await createClientAxiosInstance();
      const res = await axiosInstance.put(
        endpoint,
        { paymentMethod: selectedMethod },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.href = res.data.redirectUrl;
    } catch (err) {
      const typedError = err as AxiosError;
      if (typedError.response?.status === 403 && itemType === "course") {
        setNeedPlacementExams(true);
      } else if (typedError.response?.status === 400) {
        toast.error(text("invalidPaymentDetails"));
      } else {
        toast.error(text("paymentError"));
      }
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <section className="container grid lg:grid-cols-2 secPadding">
        <div className="py-6 lg:px-6 max-lg:order-2">
          <h1 className="h3">{text("title")}</h1>
          <p className="mt-1 font-medium text-text-3">{text("description")}</p>
          <div className="mt-4 ">
            {methods.map((method, ind) => (
              <button
                disabled={isLoading}
                key={method.value}
                onClick={() =>
                  setSelectedMethod(method.value as "card" | "crypto")
                }
                className={cn(
                  "flex items-center disabled:opacity-80 disabled:cursor-not-allowed justify-between w-full px-4 py-3 border sm:py-4  sm:px-5 max-sm:text-sm",
                  {
                    "bg-primary-faded border-primary":
                      selectedMethod === method.value,
                    "rounded-t-sm": ind === 0,
                    "rounded-b-sm": ind === methods.length - 1,
                  }
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center justify-center w-5 h-5 rounded-full ",
                      {
                        "bg-primary": selectedMethod === method.value,
                        "bg-muted": selectedMethod !== method.value,
                      }
                    )}
                  >
                    <div className="flex items-center justify-center w-2 h-2 rounded-full bg-muted" />
                  </div>
                  <span className="font-semibold text-text-2">
                    {text(method.label)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {method.logos.map((logo) => (
                    <Image
                      width={36}
                      height={24}
                      key={logo}
                      src={`/logos/${logo}`}
                      alt={method.label}
                      className="object-contain w-10 p-1 border rounded-[1px] h-7 bg-clear-ground"
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 w-fit ms-auto min-w-72">
            {selectedMethod && (
              <div>
                <ReCAPTCHA
                  sitekey="6Lc30IsqAAAAAMQTYXjAZgOEn92Yj085Hne_RWN1"
                  onChange={() => {
                    setIsVerified(true);
                  }}
                />
              </div>
            )}
            <Button
              disabled={!isVerified || !selectedMethod || isLoading}
              className="w-full mt-3"
              size={"lg"}
              onClick={handelPayment}
            >
              {text("pay")}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4 whitespace-nowrap ">
            <Link
              className="underline text-primary"
              href={"/return-and-refund-policy"}
            >
              {text("returnAndRefundPolicy")}
            </Link>
            <Link
              href={"/terms-of-services"}
              className="underline text-primary"
            >
              {text("termsOfService")}
            </Link>
            <Link href={"/privacy-policy"} className="underline text-primary">
              {text("privacyPolicy")}
            </Link>
          </div>
        </div>
        <div className="py-6 max-lg:order-1 lg:px-6">
          <div className="flex justify-between ">
            <div>
              <h5>{thisItem?.title}</h5>
              <span className="text-sm text-text-3">{text(itemType)}</span>
            </div>
            <div className="flex items-start gap-1 font-medium whitespace-nowrap">
              {thisItem?.priceAfterDiscount ? (
                <>
                  {" "}
                  <div className="h4 text-primary">
                    ${thisItem?.priceAfterDiscount}
                  </div>
                  <del className="h5 text-text-3">${thisItem?.price}</del>
                </>
              ) : (
                <div className="h4 text-primary">${thisItem?.price}</div>
              )}
            </div>
          </div>
          <form className="flex items-center gap-3 mt-4">
            <Input disabled={isLoading} placeholder={text("discountCode")} />
            <Button disabled={isLoading}>{text("apply")}</Button>
          </form>
          <div className="mt-4">
            <div className="flex justify-between mt-1 text-sm">
              <span className="font-medium">{text("subTotal")}</span>
              <span className="text-text-3">
                ${thisItem?.priceAfterDiscount || thisItem?.price}
              </span>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span className="font-medium">{text("discount")}</span>
              <span className="text-text-3">$0</span>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span className="font-medium">{text("total")}</span>
              <span className="text-text-3">
                ${thisItem?.priceAfterDiscount || thisItem?.price}
              </span>
            </div>
          </div>
        </div>
      </section>
      <Dialog open={needPlacementExams} onOpenChange={setNeedPlacementExams}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {text("pleaseMakeSureThatYouHavePassedThePlacementExams")}
            </DialogTitle>
            <DialogDescription>
              {text(
                "pleaseMakeSureThatYouHavePassedThePlacementExamsOfAllRequiredCourses"
              )}
            </DialogDescription>
          </DialogHeader>
          <ul>
            {(thisItem as ICourse)?.accessibleCourses?.map((course, index) => (
              <li key={course._id}>
                <Link
                  className="mb-2 hover:underline hover:text-primary "
                  href={`/courses/${course._id}/placement-exam`}
                  target="_blank"
                >
                  {index + 1} - {course.title}
                </Link>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MainComponent;
