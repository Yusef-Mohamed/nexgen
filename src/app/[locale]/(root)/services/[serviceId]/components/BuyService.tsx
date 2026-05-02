"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { buildCheckoutHref } from "@/lib/coupons";

interface BuyServiceProps {
  id: string;
  price?: number;
  couponCode?: string;
}

const BuyService: React.FC<BuyServiceProps> = ({ id, price, couponCode }) => {
  const text = useTranslations("servicePage");
  const [isLoading, setIsLoading] = useState(false);

  const isFree = !price || price === 0;

  const handleEnroll = async () => {
    if (isFree) {
      setIsLoading(true);
      try {
        // Handle free enrollment logic here
        console.log("Enrolling in free service:", id);
      } catch (error) {
        console.error("Enrollment error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isFree) {
    return (
      <Button
        size="lg"
        className="w-full"
        onClick={handleEnroll}
        disabled={isLoading}
      >
        {isLoading ? "..." : text("startLearning")}
      </Button>
    );
  }

  return (
    <Button size="lg" className="w-full" asChild>
      <Link href={buildCheckoutHref("service", id, couponCode)}>
        {text("startNow")}
      </Link>
    </Button>
  );
};

export default BuyService;
