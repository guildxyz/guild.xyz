import { Button } from "@chakra-ui/react"
import usePersonalSign from "hooks/usePersonalSign"
import { PropsWithChildren } from "react"
import { useFormContext } from "react-hook-form"
import useCreate from "./hooks/useCreate"

type Props = {
  onErrorHandler: (errors: any) => void
}

const SubmitButton = ({
  onErrorHandler,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { isSigning } = usePersonalSign()
  const { onSubmit, isLoading, isImageLoading, response } = useCreate()

  const { handleSubmit } = useFormContext()

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isImageLoading) return "Uploading image"
    return "Saving data"
  }

  return (
    <Button
      disabled={isLoading || isImageLoading || isSigning || !!response}
      flexShrink={0}
      size="lg"
      w={{ base: "full", sm: "auto" }}
      colorScheme="green"
      isLoading={isLoading || isImageLoading || isSigning}
      loadingText={loadingText()}
      onClick={handleSubmit(onSubmit, onErrorHandler)}
    >
      {response ? "Success" : children}
    </Button>
  )
}

export default SubmitButton
