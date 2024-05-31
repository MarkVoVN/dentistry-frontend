"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

type ErrorNotificationProps = {
  isError: boolean;
  title: string | null | undefined;
};

export function useErrorNotification({
  isError,
  title = "An unexpected error occured. Please try again later.",
}: ErrorNotificationProps) {
  useEffect(() => {
    if (isError) {
      toast.error(title);
    }
  }, [isError, title]);
}
