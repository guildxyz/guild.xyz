import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Button } from "@/components/ui/Button"
import { useWatch } from "react-hook-form"
import { CreateGuildFormType } from "../types"
import { useCreateGuildContext } from "./CreateGuildProvider"

const ChooseGuildTemplateButton = () => {
  const { setStep } = useCreateGuildContext()
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const guildName = useWatch<CreateGuildFormType, "name">({ name: "name" })

  return (
    <Button
      colorScheme="success"
      size="xl"
      disabled={!guildName || !isWeb3Connected}
      onClick={() => setStep("CHOOSE_TEMPLATE")}
    >
      Choose Guild template
    </Button>
  )
}

export { ChooseGuildTemplateButton }
