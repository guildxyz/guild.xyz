import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useState } from "react"
import pinFileToIPFS, {
  PinataPinFileResponse,
  PinToIPFSProps,
} from "./utils/pinataUpload"

type Props = Partial<{
  onSuccess: (data: PinataPinFileResponse) => void
  onError: (error: any) => void
}>

export type Uploader = {
  onUpload: (data?: PinToIPFSProps) => Promise<PinataPinFileResponse>
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

const usePinataWithProgress = (
  props: Props = {}
): Uploader & {
  progress: number
} => {
  const [progress, setProgress] = useState(0)

  const uploader = usePinata(props)

  return {
    isUploading: uploader.isUploading,
    onUpload: (ipfsProps) =>
      uploader
        .onUpload({
          ...ipfsProps,
          onProgress(currentProgress) {
            setProgress(currentProgress)
            ipfsProps.onProgress?.(currentProgress)
          },
        })
        .finally(() => {
          setProgress(0)
        }),
    progress,
  }
}

export { usePinataWithProgress }
export default usePinata
