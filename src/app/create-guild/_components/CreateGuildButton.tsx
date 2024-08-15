"use client"

import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Button } from "@/components/ui/Button"
import { Collapsible, CollapsibleContent } from "@/components/ui/Collapsible"
import { useSetAtom } from "jotai"
import { useFormContext } from "react-hook-form"
import { useCreateGuild } from "../_hooks/useCreateGuild"
import { CreateGuildFormType } from "../types"

const CreateGuildButton = () => {
  const { handleSubmit } = useFormContext<CreateGuildFormType>()
  const { onSubmit, isLoading } = useCreateGuild()

  const { isWeb3Connected } = useWeb3ConnectionManager()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  return (
    <div className="flex flex-col gap-2">
      <Collapsible open={!isWeb3Connected}>
        <CollapsibleContent>
          <Button
            colorScheme="info"
            size="xl"
            disabled={isWeb3Connected}
            onClick={() => setIsWalletSelectorModalOpen(true)}
            className="w-full"
          >
            Connect wallet
          </Button>
        </CollapsibleContent>
      </Collapsible>

      <Button
        colorScheme="success"
        size="xl"
        isLoading={isLoading}
        loadingText="Creating guild"
        onClick={handleSubmit(onSubmit)}
        disabled={!isWeb3Connected}
      >
        Create guild
      </Button>
    </div>
  )
}

export { CreateGuildButton }
