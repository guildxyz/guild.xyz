import type { Role } from "@/lib/schemas/role";
import { useMemo } from "react";
import { usePageMonoviewSuspense } from "./usePageMonoview";

export const useSuspenseRoles = () => {
  const { data: page, ...rest } = usePageMonoviewSuspense();
  return {
    ...rest,
    data: useMemo(() => page.roles as Role[], [page]),
  };
};
