import Button from "components/common/Button"
import { PropsWithChildren } from "react"

type Props = {
  isUploading: boolean
  isSigning: boolean
  isLoading: boolean
  handleSubmit: (event?: Event) => void
  response: any
}

const SubmitButton = ({
  isSigning,
  response,
  isLoading,
  handleSubmit,
  isUploading,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isUploading) return "Uploading image"
    return "Saving data"
  }

  return (
    <Button
      disabled={isLoading || isUploading || isSigning || !!response}
      flexShrink={0}
      size="lg"
      w={{ base: "full", sm: "auto" }}
      colorScheme="green"
      isLoading={isLoading || isUploading || isSigning}
      loadingText={loadingText()}
      onClick={handleSubmit}
      data-dd-action-name="Summon"
    >
      {response ? "Success" : children}
    </Button>
  )
}

export default SubmitButton
