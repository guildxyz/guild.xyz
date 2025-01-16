"use client";

import { IDENTITY_NAME, IdentityTypeSchema } from "@/lib/schemas/identity";
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

  const connectSuccessPlatformSearchParam = searchParams.get(SUCCESS_PARAM);

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
    if (!connectSuccessPlatformSearchParam) return;

    const connectSuccessPlatform = IdentityTypeSchema.safeParse(
      connectSuccessPlatformSearchParam,
    );

    const platformName = connectSuccessPlatform.error
      ? "an unknown platform"
      : IDENTITY_NAME[connectSuccessPlatform.data];

    toast(`Successfully connected ${platformName}!`, {
      icon: <CheckCircle weight="fill" className="text-icon-success" />,
    });
    removeSearchParam(SUCCESS_PARAM);
  }, [connectSuccessPlatformSearchParam, removeSearchParam]);

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
