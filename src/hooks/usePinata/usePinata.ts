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

const usePinata = ({ onError, onSuccess }: Props = {}) => {
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
