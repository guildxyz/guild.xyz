import Button from "components/common/Button"
import { useBlockedSubmit } from "components/_app/BlockedSubmit"
import { PropsWithChildren } from "react"
import { useFormContext } from "react-hook-form"
import useCreateGuild from "./hooks/useCreateGuild"

type Props = {
  onErrorHandler: (errors: any) => void
}

const SubmitButton = ({
  onErrorHandler,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { onSubmit, isLoading, response, isSigning } = useCreateGuild()
  const { handleSubmit: formHandleSubmit } = useFormContext()

  const { handleSubmit, isBlocking } = useBlockedSubmit(
    "createGuild",
    formHandleSubmit
  )

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isBlocking) return "Uploading image"
    return "Saving data"
  }

  return (
    <Button
      disabled={isLoading || isBlocking || isSigning || !!response}
      flexShrink={0}
      size="lg"
      w={{ base: "full", sm: "auto" }}
      colorScheme="green"
      isLoading={isLoading || isBlocking || isSigning}
      loadingText={loadingText()}
      onClick={handleSubmit(onSubmit, onErrorHandler)}
      data-dd-action-name="Summon"
    >
      {response ? "Success" : children}
    </Button>
  )
}

export default SubmitButton
