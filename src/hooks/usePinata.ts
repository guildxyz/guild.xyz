import { useState } from "react"
import pinFileToIPFS, {
  PinataPinFileResponse,
  PinToIPFSProps,
} from "utils/pinataUpload"

export type OnUpload = (props: PinToIPFSProps) => Promise<PinataPinFileResponse>

const usePinata = (): {
  isUploading: boolean
  onUpload: OnUpload
} => {
  const [isUploading, setIsUploading] = useState<boolean>(false)

  return {
    isUploading,
    onUpload: (props) => {
      setIsUploading(true)
      return pinFileToIPFS(props).finally(() => setIsUploading(false))
    },
  }
}

export default usePinata
