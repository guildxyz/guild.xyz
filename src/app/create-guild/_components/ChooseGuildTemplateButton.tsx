import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Button } from "@/components/ui/Button"
import { Collapsible, CollapsibleContent } from "@/components/ui/Collapsible"
import { useSetAtom } from "jotai"
import { useWatch } from "react-hook-form"
import { CreateGuildFormType } from "../types"
import { useCreateGuildContext } from "./CreateGuildProvider"

const ChooseGuildTemplateButton = () => {
  const { setStep } = useCreateGuildContext()

  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const guildName = useWatch<CreateGuildFormType, "name">({ name: "name" })

  return (
    <div className="flex flex-col gap-2">
      <Collapsible open={!isWeb3Connected}>
        <CollapsibleContent>
          <Button
            colorScheme="info"
            size="xl"
            disabled={!!isWeb3Connected}
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
        disabled={!guildName || !isWeb3Connected}
        onClick={() => setStep("CHOOSE_TEMPLATE")}
      >
        Choose Guild template
      </Button>
    </div>
  )
}

export { ChooseGuildTemplateButton }
