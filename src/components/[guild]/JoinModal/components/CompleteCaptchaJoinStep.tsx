import { Icon, useDisclosure } from "@chakra-ui/react"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { Robot } from "phosphor-react"
import { CompleteCaptchaModal } from "requirements/Captcha/components/CompleteCaptcha"
import { useAccount } from "wagmi"
import JoinStep from "./JoinStep"

const CompleteCaptchaJoinStep = (): JSX.Element => {
  const { isConnected } = useAccount()

  const {
    data: isDone,
    isLoading,
    mutate,
  } = useSWRWithOptionalAuth(`/v2/util/gate-proof-existence/CAPTCHA`)

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
        isLoading={isLoading}
      />

      <CompleteCaptchaModal
        isOpen={isOpen}
        onClose={onClose}
        onComplete={() => mutate(() => true, { revalidate: false })}
      />
    </>
  )
}

export default CompleteCaptchaJoinStep
