import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import pinFileToIPFS, {
  PinataPinFileResponse,
  PinToIPFSProps,
} from "./utils/pinataUpload"

type Props = Partial<{
  onSuccess: (data: PinataPinFileResponse) => void
  onError: (error: any) => void
}>

export type Uploader = {
  onUpload: (data?: PinToIPFSProps) => void
  isUploading: boolean
}

const usePinata = ({ onError, onSuccess }: Props = {}): Uploader => {
  const toast = useToast()

  const { isLoading: isUploading, onSubmit: onUpload } = useSubmit(
    (ipfsProps: PinToIPFSProps) => pinFileToIPFS(ipfsProps),
    {
      onSuccess,
      onError: (error) => {
        toast({
          status: "error",
          title: "Failed to upload image",
          description: error,
        })
        onError?.(error)
      },
    }
  )

  return { isUploading, onUpload }
}

export default usePinata
