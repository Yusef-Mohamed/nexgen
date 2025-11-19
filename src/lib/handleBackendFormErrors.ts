import { AxiosError } from "axios";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface BackendError {
  type?: string;
  value?: unknown;
  msg?: string;
  path?: string;
  location?: string;
}

interface BackendErrorResponse {
  errors?: BackendError[];
  message?: string;
}

const normalizePath = (path: string): string =>
  path.replace(/\[(\w+)\]/g, ".$1").replace(/^\./, "");

export const handleBackendFormErrors = <TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  error: unknown
): boolean => {
  const axiosError = error as AxiosError<BackendErrorResponse>;
  const backendErrors = axiosError?.response?.data?.errors;

  if (!Array.isArray(backendErrors) || backendErrors.length === 0) {
    return false;
  }

  backendErrors.forEach(({ path, msg }) => {
    if (!path || !msg) return;
    const normalizedPath = normalizePath(path) as Path<TFieldValues>;
    try {
      form.setError(normalizedPath, {
        type: "server",
        message: msg,
      });
    } catch {
      // Ignore invalid paths silently
    }
  });

  return true;
};

export default handleBackendFormErrors;
