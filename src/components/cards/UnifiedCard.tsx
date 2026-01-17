"use client";

import { useTranslations } from "next-intl";
import { ICourse, IPackage, ICoursePackage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { cn, getDynamicString } from "@/lib/utils";
import { ContentType, getDynamicContent } from "@/lib/dynamicContent";

interface UnifiedCardProps {
  item: ICourse | IPackage | ICoursePackage;
  contentType: ContentType;
}

const UnifiedCard = ({ item, contentType }: UnifiedCardProps) => {
  const text = useTranslations("courses");
  const dynamicContent = getDynamicContent(contentType, text);

  // Extract common properties based on content type
  const getItemData = () => {
    if (contentType === "courses") {
      const course = item as ICourse;
      return {
        id: course._id,
        title: course.title,
        image: course.image,
        status: course.status,
        detailsLink: `/instructor-dashboard/courses/${course._id}`,
      };
    }

    if (contentType === "learning-paths") {
      const learningPath = item as ICoursePackage;
      return {
        id: learningPath._id,
        title: learningPath.title,
        image: learningPath.image,
        status: learningPath.status || "active",
        detailsLink: `/instructor-dashboard/learning-paths/learning-path-form?learningPathId=${learningPath._id}&mode=edit`,
      };
    }

    if (contentType === "services") {
      const service = item as IPackage;
      return {
        id: service._id,
        title: service.title,
        image: service.image,
        status: service.status || "active",
        detailsLink: `/instructor-dashboard/services/${service._id}`,
      };
    }

    return null;
  };

  const itemData = getItemData();
  if (!itemData) return null;

  const getStatusInfo = (status: string) => {
    const isActive = status === "active" || status === "active";
    const isPending = status === "pending" || status === "under_review";

    let statusText = text("inactive");
    if (isActive) {
      statusText = text("active");
    } else if (isPending) {
      statusText = text("pending");
    }

    return {
      isActive,
      isPending,
      text: statusText,
    };
  };

  const statusInfo = getStatusInfo(itemData.status);

  return (
    <Card
      key={itemData.id}
      className="flex md:flex-row border-none cardShadow flex-col sm:p-6 p-4 overflow-hidden"
    >
      <div className="flex-shrink-0 md:w-48 w-full aspect-[1656/931] relative">
        <Image
          src={itemData.image}
          alt={getDynamicString(itemData.title)}
          fill
          className="object-cover aspect-[1656/931] rounded-md"
        />
      </div>

      <CardContent className="flex-1 md:p-6 p-4 flex flex-col justify-between">
        <div className="flex md:flex-row flex-col gap-4 justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">
              {getDynamicString(itemData.title)}
            </h3>

            <p
              className={cn(
                "font-semibold text-muted-foreground",
                statusInfo.isActive
                  ? "text-green"
                  : statusInfo.isPending
                  ? "text-yellow-600 dark:text-yellow-500"
                  : "text-destructive"
              )}
            >
              {statusInfo.text}
            </p>
          </div>

          <Button
            variant="outline"
            className="flex !text-sm max-md:w-full items-center gap-2"
            asChild
          >
            <Link href={itemData.detailsLink}>
              <Edit className="w-4 h-4" />
              {contentType === "learning-paths"
                ? text("edit")
                : dynamicContent.detailsButton}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedCard;
