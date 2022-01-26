import CtaButton from "components/common/CtaButton"
import usePersonalSign from "hooks/usePersonalSign"
import { PropsWithChildren } from "react"
import { useFormContext } from "react-hook-form"
import useCreate from "./hooks/useCreate"

type Props = {
  isUploadLoading: boolean
  onErrorHandler: (errors: any) => void
}

const SubmitButton = ({
  isUploadLoading,
  onErrorHandler,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { isSigning } = usePersonalSign()
  const { onSubmit, isLoading, response } = useCreate()

  const { handleSubmit } = useFormContext()

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isUploadLoading) return "Uploading image"
    return "Saving data"
  }

  return (
    <CtaButton
      disabled={isLoading || isUploadLoading || isSigning || response}
      flexShrink={0}
      size="lg"
      colorScheme="green"
      variant="solid"
      isLoading={isLoading || isUploadLoading || isSigning}
      loadingText={loadingText()}
      onClick={handleSubmit(onSubmit, onErrorHandler)}
    >
      {response ? "Success" : children}
    </CtaButton>
  )
}

export default SubmitButton
