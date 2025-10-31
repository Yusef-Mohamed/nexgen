import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form";
import { Plus, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DualLanguageHighlight {
  en: string;
  ar: string;
}

interface DualLanguageHighlightsListProps {
  value: DualLanguageHighlight[];
  onChange: (value: DualLanguageHighlight[]) => void;
  placeholder?: { en?: string; ar?: string };
  label?: string;
  error?: string;
  commonFormStyles?: string;
  disabled?: boolean;
  fieldErrors?: Array<{ en?: string; ar?: string }>;
}

const DualLanguageHighlightsList: React.FC<DualLanguageHighlightsListProps> = ({
  value = [],
  onChange,
  placeholder,
  label,
  error,
  commonFormStyles,
  disabled = false,
  fieldErrors = [],
}) => {
  const text = useTranslations("courses");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addHighlight = () => {
    onChange([...value, { en: "", ar: "" }]);
  };

  const removeHighlight = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const updateHighlight = (
    index: number,
    field: "en" | "ar",
    newText: string
  ) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], [field]: newText };
    onChange(newValue);
  };

  const moveHighlight = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= value.length) return;

    const newValue = [...value];
    const [movedItem] = newValue.splice(fromIndex, 1);
    newValue.splice(toIndex, 0, movedItem);
    onChange(newValue);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
    // Prevent event bubbling but don't stop default drag behavior
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    // Clear drag over state when leaving this specific item
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveHighlight(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const maxLength = 150;

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {value?.map((highlight, index) => (
          <div
            key={index}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={(e) => handleDragLeave(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={cn(
              "flex items-start gap-4",
              draggedIndex === index && "opacity-50",
              dragOverIndex === index &&
                draggedIndex !== index &&
                draggedIndex !== null &&
                "border-primary border-2"
            )}
          >
            {/* Drag Handle */}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              className="p-1 h-8 w-8 rounded-full text-primary hover:text-primary/80 hover:bg-primary/10 flex-shrink-0 mt-2 flex items-center justify-center"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Input Fields */}
            <div
              className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDragOver(e, index);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDrop(e, index);
              }}
            >
              {/* English Input */}
              <div className="space-y-1">
                <Input
                  value={highlight.en}
                  onChange={(e) => updateHighlight(index, "en", e.target.value)}
                  placeholder={
                    placeholder?.en || text("enter_highlights_english")
                  }
                  className={cn(
                    commonFormStyles,
                    fieldErrors[index]?.en && "border-destructive"
                  )}
                  disabled={disabled}
                  maxLength={maxLength}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
                <div className="flex justify-between items-center text-xs">
                  {fieldErrors[index]?.en && (
                    <span className="text-destructive">
                      {fieldErrors[index].en}
                    </span>
                  )}
                </div>
              </div>

              {/* Arabic Input */}
              <div className="space-y-1">
                <Input
                  value={highlight.ar}
                  onChange={(e) => updateHighlight(index, "ar", e.target.value)}
                  placeholder={
                    placeholder?.ar || text("enter_highlights_arabic")
                  }
                  className={cn(
                    commonFormStyles,
                    fieldErrors[index]?.ar && "border-destructive"
                  )}
                  disabled={disabled}
                  maxLength={maxLength}
                  dir="rtl"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
                <div className="flex justify-between items-center text-xs">
                  {fieldErrors[index]?.ar && (
                    <span className="text-destructive">
                      {fieldErrors[index].ar}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Delete Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeHighlight(index)}
              disabled={disabled}
              className="p-1 h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10 flex-shrink-0 mt-2"
              title={text("remove_highlight")}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {value.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-md">
            <p className="text-sm">{text("target_student_description")}</p>
          </div>
        )}
      </div>

      {/* Add Button */}
      <Button
        type="button"
        variant="primaryOutline"
        onClick={addHighlight}
        className="flex items-center gap-2 border-dashed"
        disabled={disabled || value.length >= 50}
      >
        <Plus className="w-4 h-4" />
        {text("add_highlight")}
      </Button>

      {/* Error Message */}
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
};

export default DualLanguageHighlightsList;
