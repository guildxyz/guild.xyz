import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useDisclosure } from "@/hooks/useDisclosure"
import { Robot } from "@phosphor-icons/react/dist/ssr"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { CompleteCaptchaModal } from "requirements/Captcha/components/CompleteCaptcha"
import { JoinStep } from "./JoinStep"

const CompleteCaptchaJoinStep = (): JSX.Element => {
  const { isWeb3Connected } = useWeb3ConnectionManager()

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
        title="Complete CAPTCHA"
        disabledText="Connect wallet first"
        buttonProps={{
          leftIcon: <Robot weight="bold" />,
          disabled: !isWeb3Connected,
          isLoading,
          // TODO: extract it to a constant, just like we did with PLATFORM_COLORS
          className:
            "bg-cyan-500 hover:bg-cyan-600 hover:dark:bg-cyan-400 active:bg-cyan-700 active:dark:bg-cyan-300 text-white",
          onClick: onOpen,
          children: isDone ? "Completed" : "Complete",
        }}
      />

      <CompleteCaptchaModal
        isOpen={isOpen}
        onClose={onClose}
        onComplete={() => mutate(() => true, { revalidate: false })}
      />
    </>
  )
}

// biome-ignore lint/style/noDefaultExport: we only load this component dynamically, so it's much more convenient to use a default export here
export default CompleteCaptchaJoinStep
