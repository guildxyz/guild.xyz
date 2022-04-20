import Button from "components/common/Button"
import { PropsWithChildren, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import useCreateGuild from "./hooks/useCreateGuild"

type Props = {
  isUploading: boolean
  onErrorHandler: (errors: any) => void
}

const SubmitButton = ({
  isUploading,
  onErrorHandler,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { onSubmit, isLoading, response, isSigning } = useCreateGuild()
  const { handleSubmit } = useFormContext()

  const [saveClicked, setSaveClicked] = useState<boolean>(false)

  useEffect(() => {
    if (saveClicked && !isUploading) {
      setSaveClicked(false)
      handleSubmit(onSubmit, onErrorHandler)()
    }
  }, [isUploading, saveClicked])

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isUploading) return "Uploading image"
    return "Saving data"
  }

  return (
    <Button
      disabled={isLoading || (isUploading && saveClicked) || isSigning || !!response}
      flexShrink={0}
      size="lg"
      w={{ base: "full", sm: "auto" }}
      colorScheme="green"
      isLoading={isLoading || (isUploading && saveClicked) || isSigning}
      loadingText={loadingText()}
      onClick={(event) => {
        if (isUploading) {
          setSaveClicked(true)
        } else {
          handleSubmit(onSubmit, onErrorHandler)(event)
        }
      }}
      data-dd-action-name="Summon"
    >
      {response ? "Success" : children}
    </Button>
  )
}

export default SubmitButton
