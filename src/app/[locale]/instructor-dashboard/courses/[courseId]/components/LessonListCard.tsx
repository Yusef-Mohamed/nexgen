"use client";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LessonListCardProps {
  onAddNewSection: () => void;
}

const LessonListCard = ({ onAddNewSection }: LessonListCardProps) => {
  const text = useTranslations("courses");

  return (
    <Card className="bg-white shadow-lg mb-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-2">
          {text("lesson_list")}
        </h2>
        <p className="text-gray-300 mt-2 max-w-2xl">
          {text("lesson_list_description")}
        </p>
        <Button
          className="bg-blue-600 hover:bg-blue-700 mt-4"
          onClick={onAddNewSection}
        >
          {text("add_new_section")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LessonListCard;
