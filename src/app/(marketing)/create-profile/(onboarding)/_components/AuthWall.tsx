"use client"

import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useRouter, useSearchParams } from "next/navigation"
import { PropsWithChildren, Suspense, useEffect } from "react"
import { CreateProfileSkeleton } from "./CreateProfileSkeleton"

export const AuthWall = ({ children }: PropsWithChildren) => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (isWeb3Connected === false)
      router.replace(
        ["/create-profile", searchParams].filter(Boolean).map(String).join("?")
      )
  }, [isWeb3Connected, router.replace, searchParams])

  if (!isWeb3Connected) {
    return (
      <Suspense>
        <CreateProfileSkeleton />
      </Suspense>
    )
  }

  return <Suspense>{children}</Suspense>
}
