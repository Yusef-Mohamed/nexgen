import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { ChangeEvent, useMemo, useRef } from "react";
interface ImageDropInputProps {
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  disabled?: boolean;
}

const ImageDropInput: React.FC<ImageDropInputProps> = ({
  image,
  setImage,
  disabled,
}) => {
  const text = useTranslations("Forms");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageLink = useMemo(() => {
    if (image) return URL.createObjectURL(image);
    return "";
  }, [image]);
  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (disabled) {
          return;
        }
        setImage(e.dataTransfer.files[0]);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
      }}
      onClick={() => {
        if (fileInputRef) {
          fileInputRef.current?.click();
        }
      }}
      className="flex items-center min-h-64  mt-4 justify-center border-2 border-dashed border-spacing-6 rounded-md "
    >
      {image ? (
        <Image
          src={imageLink}
          alt="Dropped"
          width={200}
          height={200}
          className="w-full h-auto rounded-md"
        />
      ) : (
        <p className="max-w-[80%] text-center">
          {text("imageDropDownPlaceHolder")}
        </p>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length > 0) {
            if (disabled) {
              return;
            }
            setImage(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};

export default ImageDropInput;
