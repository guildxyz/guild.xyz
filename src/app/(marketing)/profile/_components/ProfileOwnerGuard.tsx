"use client"

import { useUserPublic } from "@/hooks/useUserPublic"
import { PropsWithChildren, useMemo } from "react"
import { useProfile } from "../_hooks/useProfile"

export const ProfileOwnerGuard = ({
  children,
  reverseLogic = false,
}: PropsWithChildren<{ reverseLogic?: boolean }>) => {
  const { data: profile } = useProfile()
  const { id: publicUserId } = useUserPublic()
  const isProfileOwner = useMemo(
    () => !!profile?.userId && publicUserId === profile.userId,
    [publicUserId]
  )
  if (reverseLogic ? isProfileOwner : !isProfileOwner) return
  return children
}
