"use client"

import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useRouter } from "next/navigation"
import { PropsWithChildren, useEffect } from "react"
import { CreateProfileSkeleton } from "./CreateProfileSkeleton"

export const AuthWall = ({ children }: PropsWithChildren) => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const router = useRouter()

  useEffect(() => {
    if (isWeb3Connected === false) router.replace("/create-profile")
  }, [isWeb3Connected, router.replace])

  if (!isWeb3Connected) {
    return <CreateProfileSkeleton />
  }

  return children
}
