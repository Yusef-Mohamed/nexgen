"use client";
import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import FileInput from "@/components/ui/file-input";
import { X } from "lucide-react";

interface ImageUploadFieldProps {
  previewUrl?: string | null;
  loading?: boolean;
  placeholderText?: string;
  infoDescription?: string;
  guidelinesTitle?: string;
  guidelines?: string[];
  fileInputButtonText?: string;
  fileInputDescription?: string;
  accept?: string;
  className?: string;
  onFilesSelected: (files: File[]) => void;
  onRemoveImage?: () => void;
  removeIcon?: React.ReactNode;
}

const DEFAULT_ACCEPT = "image/png,image/jpeg,image/jpg,image/gif";

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  previewUrl,
  loading = false,
  placeholderText,
  infoDescription,
  guidelinesTitle,
  guidelines,
  fileInputButtonText = "Upload File",
  fileInputDescription = "No file selected",
  accept = DEFAULT_ACCEPT,
  className,
  onFilesSelected,
  onRemoveImage,
  removeIcon,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = useCallback(
    (filesList: FileList | File[] | null) => {
      if (!filesList) return;
      const filesArray = Array.isArray(filesList)
        ? filesList
        : Array.from(filesList);
      if (filesArray.length === 0) return;
      onFilesSelected(filesArray);
    },
    [onFilesSelected]
  );

  const handleHiddenInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(event.target.files);
      event.target.value = "";
    },
    [handleFiles]
  );

  const handleDragEnter = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (loading) return;
      setIsDragOver(true);
    },
    [loading]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (loading) return;
      setIsDragOver(true);
    },
    [loading]
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (loading) return;
      setIsDragOver(false);
    },
    [loading]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (loading) return;
      setIsDragOver(false);
      handleFiles(event.dataTransfer?.files ?? null);
    },
    [handleFiles, loading]
  );

  const handleClick = useCallback(() => {
    if (loading) return;
    fileInputRef.current?.click();
  }, [loading]);

  return (
    <div className={cn("flex flex-col lg:flex-row gap-6", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleClick();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex-shrink-0 w-full lg:w-[400px] h-[240px] rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden transition-all",
          {
            "bg-primary/5 border-primary border-solid": isDragOver,
            "bg-muted border-muted-foreground/30": !isDragOver,
            "opacity-60 cursor-not-allowed": loading,
            "cursor-pointer": !loading,
          }
        )}
      >
        {previewUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={previewUrl}
              alt="preview"
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover"
            />
            {onRemoveImage && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onRemoveImage();
                }}
                className="absolute top-3 end-3 flex items-center justify-center w-8 h-8 rounded-full bg-destructive text-background shadow-md"
                disabled={loading}
              >
                {removeIcon || <X className="w-4 h-4" />}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-2 opacity-60"
            >
              <path
                d="M3 18L9 12L13 16L21 8V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18Z"
                fill="currentColor"
                fillOpacity="0.4"
              />
              <path
                d="M3 18L7 14L13 20L21 10V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18Z"
                fill="currentColor"
                fillOpacity="0.6"
              />
              <circle
                cx="6"
                cy="6"
                r="2.5"
                fill="currentColor"
                fillOpacity="0.5"
              />
            </svg>
            {placeholderText && (
              <p className="text-sm text-center">{placeholderText}</p>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={loading}
          onChange={handleHiddenInputChange}
        />
      </div>

      {(infoDescription ||
        (guidelines && guidelines.length > 0) ||
        fileInputButtonText) && (
        <div className="flex-1 space-y-4">
          {(infoDescription || (guidelines && guidelines.length > 0)) && (
            <div className="space-y-2">
              {infoDescription && (
                <p className="text-sm text-foreground">{infoDescription}</p>
              )}
              {guidelines && guidelines.length > 0 && (
                <div className="space-y-1">
                  {guidelinesTitle && (
                    <p className="text-sm font-medium text-foreground">
                      {guidelinesTitle}
                    </p>
                  )}
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {guidelines.map((guideline) => (
                      <li key={guideline}>{guideline}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <FileInput
              accept={accept}
              multiple={false}
              onFilesSelected={onFilesSelected}
              disabled={loading}
              buttonText={fileInputButtonText}
              description={fileInputDescription}
              className="max-w-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
