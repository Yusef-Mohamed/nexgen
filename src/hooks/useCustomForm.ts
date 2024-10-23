import { useState } from "react";
import {
  useForm,
  UseFormReturn,
  FieldValues,
  Path,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";
import { AxiosError } from "axios";

interface UseCustomFormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
}

interface UseCustomFormReturn<T extends FieldValues> {
  form: UseFormReturn<T>;
  isLoading: boolean;
  formError: string | null;
  handleSubmit: () => void;
}

function useCustomForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
}: UseCustomFormProps<T>): UseCustomFormReturn<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    setFormError(null);

    try {
      await onSubmit(data);
    } catch (err) {
      const typedError = err as AxiosError<{
        message?: string;
        errors?: { path: string; msg: string }[];
      }>;

      if (typedError.response?.data?.errors) {
        typedError.response.data.errors.forEach((error) => {
          form.setError(error.path as Path<T>, {
            type: "manual",
            message: error.msg,
          });
        });
      } else if (typedError.response?.data?.message) {
        setFormError(typedError.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  });

  return {
    form,
    isLoading,
    formError,
    handleSubmit,
  };
}

export default useCustomForm;
