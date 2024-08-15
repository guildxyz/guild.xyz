"use client"

import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Skeleton } from "@/components/ui/Skeleton"
import { useRouter } from "next/navigation"
import { PropsWithChildren, useEffect } from "react"

export const AuthWall = ({ children }: PropsWithChildren) => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const router = useRouter()
  useEffect(() => {
    if (isWeb3Connected === false) router.replace("/create-profile")
  }, [isWeb3Connected, router.replace])
  if (!isWeb3Connected) {
    return <Skeleton className="h-[600px] w-96" />
  }
  return children
}
