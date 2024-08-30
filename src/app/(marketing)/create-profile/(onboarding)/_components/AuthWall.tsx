"use client"

import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useRouter, useSearchParams } from "next/navigation"
import { PropsWithChildren, useEffect } from "react"
import { useIsClient } from "usehooks-ts"
import { CreateProfileSkeleton } from "./CreateProfileSkeleton"

export const AuthWall = ({ children }: PropsWithChildren) => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const isClient = useIsClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (isWeb3Connected === false)
      router.replace(
        ["/create-profile", searchParams].filter(Boolean).map(String).join("?")
      )
  }, [isWeb3Connected, router.replace, searchParams])

  if (!isWeb3Connected || !isClient) {
    return <CreateProfileSkeleton />
  }

  return children
}
