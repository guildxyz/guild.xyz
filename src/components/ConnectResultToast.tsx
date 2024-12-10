"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const SUCCESS_PARAM = "connectSuccess";
const ERROR_MSG_PARAM = "connectErrorMessage";

export const ConnectResultToast = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // TODO: types
  const connectSuccessPlatform = searchParams.get(SUCCESS_PARAM);
  const connectErrorMessage = searchParams.get(ERROR_MSG_PARAM);

  const removeSearchParam = useCallback(
    (param: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(param);
      push(`${pathname}?${newSearchParams.toString()}`);
    },
    [searchParams, pathname, push],
  );

  useEffect(() => {
    if (!connectSuccessPlatform) return;
    toast(`Successfully connected ${connectSuccessPlatform}!`);
    removeSearchParam(SUCCESS_PARAM);
  }, [connectSuccessPlatform, removeSearchParam]);

  useEffect(() => {
    if (!connectErrorMessage) return;
    toast("Error", {
      description: connectErrorMessage,
    });
    removeSearchParam(ERROR_MSG_PARAM);
  }, [connectErrorMessage, removeSearchParam]);

  return null;
};
