import { useEffect, useState } from "react"
import pinFileToIPFS, { PinToIPFSProps } from "./utils/pinataUpload"

const usePinata = (handleSubmit: (event?: any) => void) => {
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
