import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useCallback } from "react"
import { useFormContext } from "react-hook-form"
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
}>

export type Uploader = {
  onUpload: (data?: PinToIPFSProps) => void
  isUploading: boolean
}

const submit = (ipfsProps: PinToIPFSProps) => pinFileToIPFS(ipfsProps)

const usePinata = ({
  onError,
  onSuccess,
  fieldToSetOnSuccess,
  fieldToSetOnError,
}: Props = {}): Uploader => {
  const toast = useToast()
  const { setValue } = useFormContext() ?? {}

  const wrappedOnError = useCallback(
    (error) => {
      toast({
        status: "error",
        title: "Failed to upload image",
        description: error,
      })
      onError?.(error)

      if (fieldToSetOnError) {
        setValue(fieldToSetOnError, `/guildLogos/${getRandomInt(286)}.svg`, {
          shouldTouch: true,
          shouldDirty: true,
        })
      }
    },
    // toast is left out intentionally
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

  const { isLoading: isUploading, onSubmit: onUpload } = useSubmit(submit, {
    onSuccess: wrappedOnSuccess,
    onError: wrappedOnError,
  })

  return { isUploading, onUpload }
}

export default usePinata
