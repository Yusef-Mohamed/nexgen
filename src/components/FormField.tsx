import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useLocale } from "next-intl";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import Image from "next/image";

interface Input<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: string;
  placeholder: string;
  values?: {
    value: string;
    label: string;
    image?: string;
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
          {(input.type === "email" ||
            input.type === "text" ||
            input.type === "password") && (
            <FormControl>
              <div className="relative">
                <Input
                  className={cn({
                    "border-destructive": errors[input.name],
                  })}
                  type={input.type}
                  placeholder={input.placeholder}
                  disabled={loading}
                  id={input.name}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
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
                      <SelectValue placeholder={input.placeholder}>
                        {field.value &&
                          input.values?.find((v) => v.value === field.value)
                            ?.image && (
                            <div className="flex items-center gap-2">
                              <Image
                                src={
                                  input.values.find(
                                    (v) => v.value === field.value
                                  )?.image || ""
                                }
                                alt=""
                                width={20}
                                height={15}
                              />
                              <span>
                                {
                                  input.values.find(
                                    (v) => v.value === field.value
                                  )?.label
                                }
                              </span>
                            </div>
                          )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {input.values?.map((value) => (
                      <SelectItem key={value.value} value={value.value}>
                        <div className="flex items-center gap-2">
                          {value.image && (
                            <Image
                              src={value.image}
                              alt=""
                              width={20}
                              height={15}
                            />
                          )}
                          <span>{value.label}</span>
                        </div>
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
