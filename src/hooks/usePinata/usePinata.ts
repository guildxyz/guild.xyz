import useSubmit from "hooks/useSubmit"
import pinFileToIPFS, {
  PinataPinFileResponse,
  PinToIPFSProps,
} from "./utils/pinataUpload"

type Props = Partial<{
  onSuccess: (data: PinataPinFileResponse) => void
  onError: (error: any) => void
}>

const usePinata = (props: Props = {}) => {
  const { isLoading: isPinning, onSubmit: onUpload } = useSubmit(
    (ipfsProps: PinToIPFSProps) => pinFileToIPFS(ipfsProps),
    props
  )

  return { isPinning, onUpload }
}

export default usePinata
