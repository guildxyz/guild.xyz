"use client"

import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Anchor } from "@/components/ui/Anchor"
import { Button, buttonVariants } from "@/components/ui/Button"
import { ArrowLeft, SignIn } from "@phosphor-icons/react"
import { useSetAtom } from "jotai"
import { useRouter } from "next/navigation"

const Page = () => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const router = useRouter()

  if (isWeb3Connected) {
    router.replace("/create-profile/claim-pass")
  }
  return (
    <div className="flex max-w-[28rem] flex-col items-center gap-4 space-y-3">
      <h1 className="text-pretty px-8 pt-8 font-bold font-display text-2xl leading-none tracking-tight">
        Sign in to create your profile
      </h1>
      <div className="w-full space-y-4 bg-card-secondary p-8">
        <Button
          onClick={() => setIsWalletSelectorModalOpen(true)}
          colorScheme="primary"
          size="lg"
          className="w-full"
        >
          <SignIn weight="bold" />
          <span>Sign in</span>
        </Button>
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
          <ArrowLeft />
          <span>Return to homepage</span>
        </Anchor>
      </div>
    </div>
  )
}

export default Page
