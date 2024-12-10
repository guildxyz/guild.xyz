"use client";

import { CheckCircle, XCircle } from "@phosphor-icons/react/dist/ssr";
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
    toast(`Successfully connected ${connectSuccessPlatform}!`, {
      icon: <CheckCircle weight="fill" className="text-icon-success" />,
    });
    removeSearchParam(SUCCESS_PARAM);
  }, [connectSuccessPlatform, removeSearchParam]);

  useEffect(() => {
    if (!connectErrorMessage) return;
    toast("Error", {
      description: connectErrorMessage,
      icon: <XCircle weight="fill" className="text-icon-error" />,
    });
    removeSearchParam(ERROR_MSG_PARAM);
  }, [connectErrorMessage, removeSearchParam]);

  return null;
};
