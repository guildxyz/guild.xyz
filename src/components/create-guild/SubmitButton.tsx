import CtaButton from "components/common/CtaButton"
import usePersonalSign from "hooks/usePersonalSign"
import { PropsWithChildren, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import useCreate from "./hooks/useCreate"

type Props = {
  uploadPromise: Promise<void>
  onErrorHandler: (errors: any) => void
}

const SubmitButton = ({
  uploadPromise,
  onErrorHandler,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { isSigning } = usePersonalSign()
  const { onSubmit, isLoading, response } = useCreate()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!!uploadPromise) {
      setIsUploading(true)
      uploadPromise.finally(() => setIsUploading(false))
    }
  }, [uploadPromise, setIsUploading])

  const { handleSubmit } = useFormContext()

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isUploading) return "Uploading image"
    return "Saving data"
  }

  return (
    <CtaButton
      disabled={isLoading || loading || isSigning || response}
      flexShrink={0}
      size="lg"
      colorScheme="green"
      variant="solid"
      isLoading={isLoading || loading || isSigning}
      loadingText={loadingText()}
      onClick={(event) => {
        // handleSubmit just for validation here, so we don't go in "uploading images" state, and focus invalid fields after the loading
        handleSubmit(() => {
          setLoading(true)
          if (isUploading) {
            uploadPromise
              .catch(() => setLoading(false))
              .then(() =>
                handleSubmit((data) => {
                  onSubmit(data)
                  setLoading(false)
                })(event)
              )
          } else {
            handleSubmit((data) => {
              onSubmit(data)
              setLoading(false)
            })(event)
          }
        }, onErrorHandler)(event)
      }}
    >
      {response ? "Success" : children}
    </CtaButton>
  )
}

export default SubmitButton
