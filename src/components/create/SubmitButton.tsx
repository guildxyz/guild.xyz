import CtaButton from "components/common/CtaButton"
import usePersonalSign from "hooks/usePersonalSign"
import { useFormContext } from "react-hook-form"
import useCreate from "./hooks/useCreate"

type Props = {
  type: "group" | "guild"
  onErrorHandler: (errors: any) => void
}

const SubmitButton = ({ type, onErrorHandler }: Props): JSX.Element => {
  const { isSigning } = usePersonalSign(true)
  const { onSubmit, isLoading, isImageLoading, response } = useCreate(type)

  const { handleSubmit } = useFormContext()

  const loadingText = (): string => {
    if (isSigning) return "Signing"
    if (isImageLoading) return "Uploading image"
    return "Saving data"
  }

  return (
    <CtaButton
      disabled={isLoading || isImageLoading || isSigning || response}
      flexShrink={0}
      size="lg"
      isLoading={isLoading || isImageLoading || isSigning}
      loadingText={loadingText()}
      onClick={handleSubmit(onSubmit, onErrorHandler)}
    >
      {response ? "Success" : "Summon"}
    </CtaButton>
  )
}

export default SubmitButton
