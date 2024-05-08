import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useCallback } from "react"
import { Control, Path, useController, useFormContext } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"
import pinFileToIPFS, {
  PinToIPFSProps,
  PinataPinFileResponse,
} from "./utils/pinataUpload"

type Props<TFieldValues, TContext> = Partial<{
  onSuccess: (data: PinataPinFileResponse) => void
  onError: (error: any) => void
  fieldToSetOnSuccess?: Path<TFieldValues>
  fieldToSetOnError?: Path<TFieldValues>
  control?: Control<TFieldValues, TContext>
}>

export type Uploader = {
  onUpload: (data?: PinToIPFSProps) => void
  isUploading: boolean
}

const usePinata = <TFieldValues, TContext>({
  onError,
  onSuccess,
  fieldToSetOnSuccess = "" as Path<TFieldValues>,
  fieldToSetOnError = "" as Path<TFieldValues>,
  control: controlFromProps,
}: Props<TFieldValues, TContext> = {}): Uploader => {
  const toast = useToast()
  const { control: controlFromContext } = useFormContext<TFieldValues>() ?? {}
  const control = controlFromContext ?? controlFromProps

  const {
    field: { onChange: successFieldOnChange },
  } = useController<TFieldValues>({
    control,
    name: fieldToSetOnSuccess,
  })

  const {
    field: { onChange: errorFieldOnChange },
  } = useController({
    control,
    name: fieldToSetOnError,
  })

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

      if (fieldToSetOnError && errorFieldOnChange) {
        errorFieldOnChange(`/guildLogos/${getRandomInt(286)}.svg`)
      }
    },
    // toast is left out intentionally
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onError, fieldToSetOnError, errorFieldOnChange]
  )

  const wrappedOnSuccess = useCallback(
    (response: PinataPinFileResponse) => {
      onSuccess?.(response)

      if (fieldToSetOnSuccess && successFieldOnChange) {
        successFieldOnChange(
          `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${response.IpfsHash}`
        )
      }
    },
    [onSuccess, fieldToSetOnSuccess, successFieldOnChange]
  )

  const { isLoading: isUploading, onSubmit: onUpload } = useSubmit(pinFileToIPFS, {
    onSuccess: wrappedOnSuccess,
    onError: wrappedOnError,
  })

  return { isUploading, onUpload }
}

export default usePinata
