import { useEffect, useState } from "react"
import pinFileToIPFS, {
  PinataPinFileResponse,
  PinToIPFSProps,
} from "./utils/pinataUpload"

export type OnUpload = (props: PinToIPFSProps) => Promise<PinataPinFileResponse>

const usePinata = (
  handleSubmit: (event?: any) => void
): {
  handleSubmit: (event: any) => void
  isUploading: boolean
  onUpload: OnUpload
} => {
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const [saveClicked, setSaveClicked] = useState<boolean>(false)
  useEffect(() => {
    if (saveClicked && !isUploading) {
      setSaveClicked(false)
      handleSubmit?.()
    }
  }, [isUploading, saveClicked])

  return {
    handleSubmit: (event) => {
      if (isUploading) {
        setSaveClicked(true)
      } else {
        handleSubmit(event)
      }
    },
    isUploading: isUploading && saveClicked,
    onUpload: (props: PinToIPFSProps) => {
      setIsUploading(true)
      return pinFileToIPFS(props).finally(() => setIsUploading(false))
    },
  }
}

export default usePinata
