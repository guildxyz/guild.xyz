"use client"

import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Button } from "@/components/ui/Button"
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
    <div className="flex w-[28rem] items-center gap-8 space-y-3 p-8">
      <h1 className="text-pretty font-bold font-display text-2xl leading-none tracking-tight">
        Sign in to create your profile
      </h1>
      <Button
        onClick={() => setIsWalletSelectorModalOpen(true)}
        colorScheme="primary"
        size="lg"
      >
        <span>Sign in</span>
      </Button>
    </div>
  )
}

export default Page
