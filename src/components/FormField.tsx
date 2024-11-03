import React, { useState } from "react";
import {
  FieldValues,
  Path,
  UseFormReturn,
  useFormState,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useLocale } from "next-intl";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

interface Input<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: string;
  placeholder: string;
  values?: {
    value: string;
    label: string;
  }[];
  required?: boolean;
}

interface FormFieldProps<T extends FieldValues> {
  input: Input<T>;
  form: UseFormReturn<T>;
  loading: boolean;
}

const CustomFormField = <T extends FieldValues>({
  input,
  form,
  loading,
}: FormFieldProps<T>) => {
  const [isShow, setIsShow] = useState(false);
  const { errors } = useFormState({ control: form.control });
  const locale = useLocale();
  return (
    <FormField
      key={input.name}
      control={form.control}
      name={input.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            htmlFor={input.name}
            className="text-sm font-semibold text-text-2"
          >
            {input.label}{" "}
            {input.required && <span className="text-destructive">*</span>}
          </FormLabel>
          {(input.type === "password" ||
            input.type === "email" ||
            input.type === "text") && (
            <FormControl>
              <div className="relative">
                <div
                  style={{
                    pointerEvents: "none",
                  }}
                  className="absolute flex items-center justify-end w-full h-full px-4"
                >
                  {input.type === "password" && (
                    <button
                      type="button"
                      onClick={() => setIsShow((prev) => !prev)}
                      className="focus:outline-none text-subText"
                      tabIndex={-1}
                      style={{
                        pointerEvents: "auto",
                      }}
                    >
                      {isShow ? <EyeOff /> : <Eye />}
                    </button>
                  )}
                </div>
                <Input
                  className={cn({
                    "pe-12": input.type === "password",
                    "border-destructive": errors[input.name],
                  })}
                  type={
                    input.type === "password" && isShow ? "text" : input.type
                  }
                  placeholder={input.placeholder}
                  disabled={loading}
                  id={input.name}
                  {...field}
                />
              </div>
            </FormControl>
          )}
          {input.type === "select" && (
            <FormControl>
              <div className="relative">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                  {...field}
                >
                  <FormControl>
                    <SelectTrigger
                      style={{
                        direction: locale === "ar" ? "rtl" : "ltr",
                      }}
                      id={input.name}
                      className={cn("text-subText w-full justify-between", {
                        "border-destructive": errors[input.name],
                      })}
                    >
                      <SelectValue placeholder={input.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {input.values?.map((value) => (
                      <SelectItem key={value.value} value={value.value}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormControl>
          )}
          {input.type === "otp" && (
            <FormControl>
              <InputOTP maxLength={6} {...field}>
                <InputOTPGroup
                  style={{
                    direction: "ltr",
                  }}
                  className="flex items-center justify-center w-full gap-4"
                >
                  <InputOTPSlot
                    index={0}
                    className={cn({
                      "border-destructive": errors[input.name],
                    })}
                  />
                  <InputOTPSlot
                    index={1}
                    className={cn({
                      "border-destructive": errors[input.name],
                    })}
                  />
                  <InputOTPSlot
                    index={2}
                    className={cn({
                      "border-destructive": errors[input.name],
                    })}
                  />
                  <InputOTPSlot
                    index={3}
                    className={cn({
                      "border-destructive": errors[input.name],
                    })}
                  />
                  <InputOTPSlot
                    index={4}
                    className={cn({
                      "border-destructive": errors[input.name],
                    })}
                  />
                  <InputOTPSlot
                    index={5}
                    className={cn({
                      "border-destructive": errors[input.name],
                    })}
                  />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
          )}
          <FormMessage className="text-sm" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
