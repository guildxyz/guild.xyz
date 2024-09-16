"use client"

import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Anchor } from "@/components/ui/Anchor"
import { Button, buttonVariants } from "@/components/ui/Button"
import { SignIn } from "@phosphor-icons/react"
import { useSetAtom } from "jotai"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useIsClient } from "usehooks-ts"

const Page = () => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isClient = useIsClient()

  useEffect(() => {
    if (isWeb3Connected) {
      router.replace(
        ["/create-profile/prompt-referrer", searchParams]
          .filter(Boolean)
          .map(String)
          .join("?")
      )
    }
  }, [isWeb3Connected, router.replace, searchParams])

  return (
    <div className="flex max-w-sm flex-col gap-4">
      <div className="space-y-6 px-8 pt-8">
        <h1 className="text-pretty font-bold font-display text-2xl leading-none tracking-tight">
          Sign in to create your profile
        </h1>
        <p className="text-pretty text-muted-foreground leading-normal">
          Start your new profile adventure by signing in: earn experience, display
          achievements and explore new rewards!
        </p>
      </div>
      <div className="mt-4 flex w-full gap-4 bg-card-secondary px-8 py-4">
        <Anchor
          href="/"
          variant="unstyled"
          className={buttonVariants({
            colorScheme: "secondary",
            variant: "ghost",
            size: "lg",
            className: "w-full",
          })}
        >
          <span>Back to home</span>
        </Anchor>
        <Button
          onClick={() => setIsWalletSelectorModalOpen(true)}
          colorScheme="primary"
          size="lg"
          className="w-full"
          isLoading={isClient && isWeb3Connected === null}
        >
          <SignIn weight="bold" />
          <span>Sign in</span>
        </Button>
      </div>
    </div>
  )
}

export default Page
