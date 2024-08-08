"use client"

import { useUserPublic } from "@/hooks/useUserPublic"
import { PropsWithChildren } from "react"
import { useProfile } from "../_hooks/useProfile"

export const ProfileOwnerGuard = ({ children }: PropsWithChildren) => {
  const { data: profile } = useProfile()
  const { id: publicUserId } = useUserPublic()
  const isProfileOwner = !!profile?.userId && publicUserId === profile.userId

  if (!isProfileOwner) return
  return children
}
