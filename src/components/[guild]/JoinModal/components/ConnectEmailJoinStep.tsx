import { ConnectEmailButton } from "@/components/Account/components/AccountModal/components/EmailAddress"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { cn } from "@/lib/utils"
import { EnvelopeSimple } from "@phosphor-icons/react"
import useUser from "components/[guild]/hooks/useUser"
import { JoinStepUI } from "./JoinStep"

const ConnectEmailJoinStep = (): JSX.Element => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const { emails } = useUser()

  const isDone = Boolean(emails?.emailAddress && !emails.pending)

  return (
    <JoinStepUI isDone={isDone} title="Connect email">
      <Tooltip open={isWeb3Connected ? undefined : false}>
        <TooltipTrigger className="cursor-default">
          <ConnectEmailButton
            disabled={!isWeb3Connected || isDone}
            size="md"
            className={cn("min-w-max shrink-0", { "max-w-40": isDone })}
            leftIcon={<EnvelopeSimple />}
          />
        </TooltipTrigger>

        <TooltipContent>
          <span>Connect wallet first</span>
        </TooltipContent>
      </Tooltip>
    </JoinStepUI>
  )
}

// biome-ignore lint/style/noDefaultExport: we only load this component dynamically, so it's much more convenient to use a default export here
export default ConnectEmailJoinStep
