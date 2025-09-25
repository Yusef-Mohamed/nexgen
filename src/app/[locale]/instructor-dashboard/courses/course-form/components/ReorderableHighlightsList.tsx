import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form";
import { Plus, X, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReorderableHighlightsListProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  commonFormStyles?: string;
  disabled?: boolean;
  fieldErrors?: string[]; // Array of error messages for each highlight field
}

const ReorderableHighlightsList: React.FC<ReorderableHighlightsListProps> = ({
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

  const addHighlight = () => {
    onChange([...value, ""]);
  };

  const removeHighlight = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const updateHighlight = (index: number, newText: string) => {
    const newValue = [...value];
    newValue[index] = newText;
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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveHighlight(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <div className="space-y-2">
        {value?.map((highlight, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "flex items-center gap-2 p-2 border rounded-md bg-background transition-colors",
              draggedIndex === index && "opacity-50",
              "hover:bg-muted/50"
            )}
          >
            {/* Drag Handle */}
            <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Input Field */}
            <div className="flex-1">
              <Input
                value={highlight}
                onChange={(e) => updateHighlight(index, e.target.value)}
                placeholder={placeholder || text("highlight_placeholder")}
                className={cn(
                  commonFormStyles,
                  "flex-1",
                  fieldErrors[index] && "border-destructive"
                )}
                disabled={disabled}
              />
              {fieldErrors[index] && (
                <p className="text-sm text-destructive mt-1">
                  {fieldErrors[index]}
                </p>
              )}
            </div>

            {/* Move Up/Down Buttons */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveHighlight(index, index - 1)}
                disabled={disabled || index === 0}
                className="p-1 h-8 w-8"
                title={text("move_up")}
              >
                <ChevronUp className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveHighlight(index, index + 1)}
                disabled={disabled || index === value.length - 1}
                className="p-1 h-8 w-8"
                title={text("move_down")}
              >
                <ChevronDown className="w-3 h-3" />
              </Button>
            </div>

            {/* Remove Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeHighlight(index)}
              disabled={disabled}
              className="p-1 h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              title={text("remove_highlight")}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}

        {value.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-md">
            <p className="text-sm">{text("reorder_highlights")}</p>
          </div>
        )}
      </div>

      {/* Add Button */}
      <Button
        type="button"
        variant="outline"
        onClick={addHighlight}
        className="w-full flex items-center gap-2 border-dashed"
        disabled={disabled || value.length >= 10}
      >
        <Plus className="w-4 h-4" />
        {text("add_highlight")}
      </Button>

      {/* Error Message */}
      {error && <FormMessage>{error}</FormMessage>}

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground">
        {text("reorder_highlights")} • {value.length}/10
      </p>
    </div>
  );
};

export default ReorderableHighlightsList;
