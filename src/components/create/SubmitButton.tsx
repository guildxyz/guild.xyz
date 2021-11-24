import CtaButton from "components/common/CtaButton"
import usePersonalSign from "hooks/usePersonalSign"
import { useFormContext } from "react-hook-form"
import useCreate from "./hooks/useCreate"

type Props = {
  type: "hall" | "guild"
  onErrorHandler: (errors: any) => void
}

const SubmitButton = ({ type, onErrorHandler }: Props): JSX.Element => {
  const { isSigning } = usePersonalSign()
  const { onSubmit, isLoading, isImageLoading, response } = useCreate(type)

  const { handleSubmit } = useFormContext()

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isImageLoading) return "Uploading image"
    return "Saving data"
  }

  return (
    <CtaButton
      disabled={isLoading || isImageLoading || isSigning || response}
      flexShrink={0}
      size="lg"
      colorScheme="green"
      variant="solid"
      isLoading={isLoading || isImageLoading || isSigning}
      loadingText={loadingText()}
      onClick={handleSubmit(onSubmit, onErrorHandler)}
    >
      {response ? "Success" : "Summon"}
    </CtaButton>
  )
}

export default SubmitButton
