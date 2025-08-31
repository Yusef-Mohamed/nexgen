"use client";
import React, { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export interface FileInputProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
  buttonText?: string;
  maxFileSize?: string;
  onFilesSelected: (files: File[]) => void;
}

/**
 * Accessible, reusable drag-and-drop file input.
 * - Shows dashed border while dragging, primary border when dragging over.
 * - Clears native input value after each selection to avoid lingering filenames.
 * - Matches the styling of the regular input component.
 */
const FileInput: React.FC<FileInputProps> = ({
  accept,
  multiple,
  disabled,
  className,
  label,
  description,
  buttonText,
  maxFileSize,
  onFilesSelected,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Get translations using next-intl
  const text = useTranslations("Forms.fileInput");

  const openFileDialog = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const clearNativeValue = useCallback((input: HTMLInputElement | null) => {
    if (!input) return;
    try {
      input.value = "";
    } catch {}
  }, []);

  const handleFiles = useCallback(
    (filesList: FileList | null) => {
      if (!filesList) return;
      const files = Array.from(filesList);
      if (files.length === 0) return;
      setSelectedFiles(files);
      onFilesSelected(files);
      clearNativeValue(inputRef.current);
    },
    [onFilesSelected, clearNativeValue]
  );

  const onChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const onDragEnter = useCallback<React.DragEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setIsDragging(true);
    },
    [disabled]
  );

  const onDragOver = useCallback<React.DragEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setIsDragOver(true);
    },
    [disabled]
  );

  const onDragLeave = useCallback<React.DragEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setIsDragOver(false);
      setIsDragging(false);
    },
    [disabled]
  );

  const onDrop = useCallback<React.DragEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setIsDragOver(false);
      setIsDragging(false);
      const files = e.dataTransfer?.files ?? null;
      if (files && files.length > 0) {
        const fileArray = Array.from(files);
        setSelectedFiles(fileArray);
        onFilesSelected(fileArray);
        clearNativeValue(inputRef.current);
      }
    },
    [disabled, onFilesSelected, clearNativeValue]
  );

  const getAcceptedFormats = () => {
    if (!accept) return "";
    return accept
      .split(",")
      .map((format) => format.trim())
      .join(", ");
  };

  const getFileCountText = () => {
    if (selectedFiles.length === 0) return "";
    if (selectedFiles.length === 1) {
      return `${selectedFiles.length} ${text("fileSelected")}`;
    }
    return `${selectedFiles.length} ${text("filesSelected")}`;
  };

  const borderClasses = cn(
    "flex md:h-[3rem] lg:h-[3.25rem] min-w-36 md:px-5 md:py-3 px-4 py-2 h-[2.75rem] text-sm md:text-base w-full rounded-md border bg-transparent shadow-sm transition-colors",
    "items-center text-center cursor-pointer",
    disabled ? "opacity-60 cursor-not-allowed" : "",
    isDragOver
      ? "border-primary ring-1 ring-ring"
      : isDragging
      ? "border-dashed border-input"
      : "border-input",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none">{label}</label>
      )}
      <div
        role="button"
        tabIndex={0}
        onClick={openFileDialog}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openFileDialog();
        }}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={borderClasses}
        aria-disabled={disabled}
      >
        <div className="flex items-center gap-1">
          {selectedFiles.length > 0 ? (
            <span className="text-sm text-foreground font-medium">
              {getFileCountText()}
            </span>
          ) : (
            <>
              {description && (
                <span className="text-sm text-muted-foreground">
                  {description}
                </span>
              )}
              {buttonText ? (
                <span className="text-sm text-primary font-medium">
                  {buttonText}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {text("dragAndDropText")}
                </span>
              )}
            </>
          )}
        </div>
      </div>
      {(accept || maxFileSize) && (
        <div className="text-xs text-muted-foreground">
          {accept && (
            <span>
              {text("acceptedFormats")}
              {getAcceptedFormats()}
            </span>
          )}
          {accept && maxFileSize && " • "}
          {maxFileSize && (
            <span>
              {text("maxFileSize")}
              {maxFileSize}
            </span>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
};

export default FileInput;
