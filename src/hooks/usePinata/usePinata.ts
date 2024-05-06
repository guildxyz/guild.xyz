import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useCallback } from "react"
import pinFileToIPFS, {
  PinToIPFSProps,
  PinataPinFileResponse,
} from "./utils/pinataUpload"

type Props = Partial<{
  onSuccess: (data: PinataPinFileResponse) => void
  onError: (error: any) => void
}>

export type Uploader = {
  onUpload: (data?: PinToIPFSProps) => void
  isUploading: boolean
}

const submit = (ipfsProps: PinToIPFSProps) => pinFileToIPFS(ipfsProps)

const usePinata = ({ onError, onSuccess }: Props = {}): Uploader => {
  const toast = useToast()

  const wrappedOnError = useCallback(
    (error) => {
      toast({
        status: "error",
        title: "Failed to upload image",
        description: error,
      })
      onError?.(error)
    },
    // toast is left out intentionally
    [onError]
  )

  const { isLoading: isUploading, onSubmit: onUpload } = useSubmit(submit, {
    onSuccess,
    onError: wrappedOnError,
  })

  return { isUploading, onUpload }
}

export default usePinata
