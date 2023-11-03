import { Icon, useDisclosure } from "@chakra-ui/react"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { Robot } from "phosphor-react"
import { CompleteCaptchaModal } from "requirements/Captcha/components/CompleteCaptcha"
import { useAccount } from "wagmi"
import JoinStep from "./JoinStep"

const CompleteCaptchaJoinStep = (): JSX.Element => {
  const { isConnected } = useAccount()

  const { roles } = useGuild()
  const requirements = roles?.flatMap((role) => role.requirements) ?? []
  const captchaRequirements = requirements
    ?.filter((req) => req.type === "CAPTCHA")
    .map((req) => req.id)

  const { data: accesses } = useAccess()
  const requirementAccesses = accesses?.flatMap((access) => access.requirements)

  const isDone = requirementAccesses?.some(
    (reqAccess) =>
      captchaRequirements.includes(reqAccess.requirementId) && reqAccess.access
  )

  const { onOpen, onClose, isOpen } = useDisclosure()

  return (
    <>
      <JoinStep
        isDone={isDone}
        colorScheme="cyan"
        icon={<Icon as={Robot} />}
        title="Complete CAPTCHA"
        buttonLabel={isDone ? "Completed" : "Complete"}
        onClick={onOpen}
        isDisabled={!isConnected && "Connect wallet first"}
      />

      <CompleteCaptchaModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default CompleteCaptchaJoinStep
