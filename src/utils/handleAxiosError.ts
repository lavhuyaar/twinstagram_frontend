import { isAxiosError } from "axios";
import type { SetStateAction } from "react";
import { toast } from "react-toastify";

export const handleAxiosError = (
  error: unknown,
  helperMessage?: string,
  setError?: React.Dispatch<SetStateAction<string | undefined>>,
  hideToast?: boolean
) => {
  console.error(error, helperMessage ? ` :: ${helperMessage}` : "");
  if (isAxiosError(error)) {
    if (!hideToast) {
      toast.dismiss();
      toast.error(error.response?.data?.error || helperMessage); //Error snackbar
    }
    if (setError) {
      setError(error.response?.data?.error || "Internal Server Error");
    }
    throw error;
  } else {
    if (!hideToast) {
      toast.dismiss();
      toast.error("An error occured! Please try again!");
    }
  }
};
