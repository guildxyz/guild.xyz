import { useState } from "react"
import pinFileToIPFS, {
  PinataPinFileResponse,
  PinToIPFSProps,
} from "./utils/pinataUpload"

export type OnUpload = (props: PinToIPFSProps) => Promise<PinataPinFileResponse>

const usePinata = (): {
  isPinning: boolean
  onUpload: OnUpload
} => {
  const [isPinning, setIsPinning] = useState<boolean>(false)

  return {
    isPinning,
    onUpload: (props: PinToIPFSProps) => {
      setIsPinning(true)
      return pinFileToIPFS(props).finally(() => setIsPinning(false))
    },
  }
}

export default usePinata
