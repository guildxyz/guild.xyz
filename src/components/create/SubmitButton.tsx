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

  /**
   * Removing empty requirements if there are any - this is needed because for some
   * reason, react-hook-form doesn't always delete all requirements
   */
  const onSubmitWithChecks = (data: Record<string, any>) => {
    if (!data?.requirements) {
      data.requirements = []
    } else {
      data.requirements = data.requirements?.filter(
        (requirement) => requirement.address || requirement.key || requirement.value
      )
    }

    onSubmit(data)
  }

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
      onClick={handleSubmit(onSubmitWithChecks, onErrorHandler)}
    >
      {response ? "Success" : "Summon"}
    </CtaButton>
  )
}

export default SubmitButton
