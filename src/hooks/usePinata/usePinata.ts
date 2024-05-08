import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useCallback } from "react"
import { UseFormSetValue, useFormContext } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"
import pinFileToIPFS, {
  PinToIPFSProps,
  PinataPinFileResponse,
} from "./utils/pinataUpload"

type Props = Partial<{
  onSuccess: (data: PinataPinFileResponse) => void
  onError: (error: any) => void
  fieldToSetOnSuccess: string
  fieldToSetOnError: string
  setValue: UseFormSetValue<any>
}>

export type Uploader = {
  onUpload: (data?: PinToIPFSProps) => void
  isUploading: boolean
}

const usePinata = ({
  onError,
  onSuccess,
  fieldToSetOnSuccess,
  fieldToSetOnError,
  setValue: setValueFromProp,
}: Props = {}): Uploader => {
  const toast = useToast()
  const { setValue: setValueFromContext } = useFormContext() ?? {}
  const setValue = setValueFromProp || setValueFromContext

  const wrappedOnError = useCallback(
    (error) => {
      const description =
        typeof error === "string"
          ? error
          : error instanceof Error
          ? error.message
          : undefined

      toast({
        status: "error",
        title: "Failed to upload image",
        description,
      })
      onError?.(error)

      if (fieldToSetOnError && setValue) {
        setValue(fieldToSetOnError, `/guildLogos/${getRandomInt(286)}.svg`, {
          shouldTouch: true,
          shouldDirty: true,
        })
      }
    },
    // toast is left out intentionally
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onError, fieldToSetOnError, setValue]
  )

  const wrappedOnSuccess = useCallback(
    (response: PinataPinFileResponse) => {
      onSuccess?.(response)

      if (fieldToSetOnSuccess) {
        setValue(
          fieldToSetOnSuccess,
          `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${response.IpfsHash}`,
          {
            shouldTouch: true,
            shouldDirty: true,
          }
        )
      }
    },
    [onSuccess, setValue, fieldToSetOnSuccess]
  )

  const { isLoading: isUploading, onSubmit: onUpload } = useSubmit(pinFileToIPFS, {
    onSuccess: wrappedOnSuccess,
    onError: wrappedOnError,
  })

  return { isUploading, onUpload }
}

export default usePinata
